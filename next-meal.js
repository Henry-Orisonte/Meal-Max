"use strict";

// Shared with saved-recipes-page.html.
const SAVED_RECIPES_KEY = "savedRecipes";
const cardTemplate = document.getElementById("recipe-card-template");
const form = document.getElementById("search-form");
const query = document.getElementById("query");
const list = document.getElementById("recipe-list");
const popup = document.getElementById("recipe-popup");
const saveButton = document.getElementById("save-recipe");
const popupStatus = document.getElementById("popup-status");
let selectedRecipe = null;
const nutritionInputs = [...form.querySelectorAll('input[type="number"]')];

function readLimits() {
  const limits = {};
  const errors = [];
  nutritionInputs.forEach(input => input.removeAttribute("aria-invalid"));
  nutritionFields.forEach(field => {
    const inputs = [document.getElementById(field + "-min"), document.getElementById(field + "-max")];
    const values = inputs.map(input => input.value === "" ? null : Number(input.value));
    limits[field] = { min: values[0], max: values[1] };
    const invalid = inputs.filter(input => !input.validity.valid);
    const label = field[0].toUpperCase() + field.slice(1);
    if (invalid.length) {
      invalid.forEach(input => input.setAttribute("aria-invalid", "true"));
      errors.push(label + ": enter a number of zero or more.");
    } else if (values[0] !== null && values[1] !== null && values[0] > values[1]) {
      inputs.forEach(input => input.setAttribute("aria-invalid", "true"));
      errors.push(label + ": minimum must not exceed maximum.");
    }
  });
  const error = document.getElementById("filter-error");
  error.textContent = errors.join(" ");
  error.hidden = errors.length === 0;
  return errors.length ? null : limits;
}

function nutritionText(recipe) {
  const { protein, fat, calories } = recipe.nutrition;
  return `${protein} g protein · ${fat} g fat · ${calories} kcal per serving (est.)`;
}

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function readSavedRecipes() {
  const stored = JSON.parse(localStorage.getItem(SAVED_RECIPES_KEY) || "[]");
  if (!Array.isArray(stored)) {
    throw new Error("Invalid saved recipe data");
  }
  return stored;
}

function isSaved(recipe, saved) {
  return saved.some(item => item && (String(item.id) === String(recipe.id) || item.title === recipe.title));
}

function readSearch() {
  const params = new URLSearchParams(location.search);
  query.value = params.get("q") || params.get("ingredients") || "";
  nutritionInputs.forEach(input => {
    const value = params.get(input.name);
    // Ignore malformed or negative URL limits rather than silently using them.
    input.value = value !== null && value.trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0 ? String(Number(value)) : "";
  });
}

function updateSearch() {
  const url = new URL(location.href);
  ["ingredients", "diet", "cuisine", "maxTime"].forEach(name => url.searchParams.delete(name));
  const text = query.value.trim();
  if (text) url.searchParams.set("q", text);
  else url.searchParams.delete("q");
  nutritionInputs.forEach(input => {
    if (input.value !== "") url.searchParams.set(input.name, input.value);
    else url.searchParams.delete(input.name);
  });

  try {
    history.replaceState(null, "", url);
  } catch {}
  renderRecipes();
}

function createRecipeCard(recipe, saved) {
  const row = cardTemplate.content.firstElementChild.cloneNode(true);
  const button = row.querySelector(".recipe-card");
  const image = row.querySelector(".recipe-photo");
  const tags = row.querySelector(".recipe-tags");

  button.dataset.recipeId = recipe.id;
  button.setAttribute("aria-label", "View recipe: " + recipe.title);
  image.src = recipe.photo;
  row.querySelector(".recipe-title").textContent = recipe.title;
  row.querySelector(".recipe-meta").textContent = recipe.time + " min · " + recipe.servings + " servings";
  row.querySelector(".recipe-nutrition").textContent = nutritionText(recipe);
  row.querySelector(".recipe-desc").textContent = recipe.summary;

  const cuisineName = recipe.cuisine[0].toUpperCase() + recipe.cuisine.slice(1);
  tags.append(createElement("span", "recipe-tag", cuisineName));
  if (recipe.diets.length) {
    const dietName = recipe.diets.includes("vegan") ? "Vegan" : "Vegetarian";
    tags.append(createElement("span", "recipe-tag", dietName));
  }
  if (isSaved(recipe, saved)) {
    tags.append(createElement("span", "recipe-tag saved-tag", "Saved"));
  }

  button.addEventListener("click", () => openRecipe(recipe));
  return row;
}

function renderRecipes() {
  const limits = readLimits();
  document.getElementById("clear-search").hidden = !query.value;
  document.getElementById("clear-filters").hidden = !nutritionInputs.some(input => input.value !== "" || input.validity.badInput);
  if (!limits) {
    list.replaceChildren();
    list.hidden = true;
    document.getElementById("empty-state").hidden = true;
    document.getElementById("result-count").textContent = "Check nutrition limits";
    return;
  }
  const matches = filterRecipes(nextMealRecipes, query.value, limits);
  let saved = [];
  try {
    saved = readSavedRecipes();
  } catch {
  }
  list.replaceChildren(...matches.map(recipe => createRecipeCard(recipe, saved)));
  list.scrollTop = 0;
  list.hidden = matches.length === 0;
  document.getElementById("empty-state").hidden = matches.length > 0;
  document.getElementById("result-count").textContent = matches.length + (matches.length === 1 ? " recipe found" : " recipes found");
}

function updateSaveButton() {
  let saved = false;
  try {
    saved = isSaved(selectedRecipe, readSavedRecipes());
  } catch {

  }
  saveButton.disabled = saved;
  saveButton.textContent = saved ? "Saved to My Saved Recipes ✓" : "Add to My Saved Recipes +";
}

function openRecipe(recipe) {
  selectedRecipe = recipe;
  document.getElementById("popup-title").textContent = recipe.title;
  const image = document.getElementById("popup-photo");
  image.src = recipe.photo;
  image.alt = recipe.title;
  document.getElementById("popup-meta").textContent = recipe.time + " min total · " + recipe.servings + " servings";
  document.getElementById("popup-nutrition").textContent = nutritionText(recipe);
  document.getElementById("popup-description").textContent = recipe.description;
  document.getElementById("popup-ingredients").replaceChildren(...recipe.ingredients.map(text => createElement("li", "", text)));
  document.getElementById("popup-directions").replaceChildren(...recipe.directions.map(text => createElement("li", "", text)));
  popupStatus.textContent = "";
  updateSaveButton();
  popup.showModal();
  popup.scrollTop = 0;
}

function saveRecipe() {
  if (!selectedRecipe) return;
  try {
    const saved = readSavedRecipes();
    if (!isSaved(selectedRecipe, saved)) {
      saved.push(selectedRecipe);
      localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(saved));
    }
    updateSaveButton();
    popupStatus.textContent = selectedRecipe.title + " is in My Saved Recipes.";
  } catch {
    popupStatus.textContent = "This recipe couldn't be saved. Allow browser storage and try again.";
  }
}

function closeOnBackdropClick(event) {
  if (event.target !== popup) return;
  const bounds = popup.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) popup.close();
}

function refreshSavedBadges() {
  let saved;
  try {
    saved = readSavedRecipes();
  } catch {
    return;
  }

  // Update the cards in place so closing the popup restores focus to its button.
  list.querySelectorAll(".recipe-card").forEach(button => {
    const recipe = nextMealRecipes.find(item => String(item.id) === button.dataset.recipeId);
    const tags = button.querySelector(".recipe-tags");
    const badge = tags.querySelector(".saved-tag");
    if (isSaved(recipe, saved) && !badge) {
      tags.append(createElement("span", "recipe-tag saved-tag", "Saved"));
    } else if (!isSaved(recipe, saved) && badge) {
      badge.remove();
    }
  });
}

function clearSearch() {
  query.value = "";
  updateSearch();
  query.focus();
}

saveButton.addEventListener("click", saveRecipe);
popup.querySelector(".close-popup").addEventListener("click", () => popup.close());
popup.addEventListener("click", closeOnBackdropClick);
popup.addEventListener("close", refreshSavedBadges);
form.addEventListener("submit", event => {
  event.preventDefault();
  updateSearch();
});
document.getElementById("clear-search").addEventListener("click", clearSearch);
query.addEventListener("input", updateSearch);
nutritionInputs.forEach(input => input.addEventListener("input", updateSearch));
document.getElementById("clear-filters").addEventListener("click", () => {
  nutritionInputs.forEach(input => { input.value = ""; });
  updateSearch();
  nutritionInputs[0].focus();
});
query.addEventListener("search", updateSearch);
document.getElementById("show-all").addEventListener("click", () => {
  nutritionInputs.forEach(input => { input.value = ""; });
  clearSearch();
});
window.addEventListener("popstate", () => {
  readSearch();
  renderRecipes();
});
window.addEventListener("storage", event => {
  if (event.key === SAVED_RECIPES_KEY || event.key === null) {
    if (popup.open) updateSaveButton();
    else renderRecipes();
  }
});

readSearch();
renderRecipes();
