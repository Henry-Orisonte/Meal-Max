"use strict";

function resetCartPicker() {
  document.getElementById("cart-picker").hidden = true;
  document.getElementById("new-cart-form").hidden = true;
  document.getElementById("cart-back").hidden = true;
}

function recipeForCart(recipe) {
  const sample = nextMealRecipes.find(item => item.title === recipe.title);
  // Older saved copies contain only a title, description, and photo.
  return { ...recipe, ingredients: recipe.ingredients || sample?.ingredients || [] };
}

function showCartView(recipe, state, title) {
  const dialog = document.getElementById("recipe-popup");
  const heading = document.getElementById("popup-title");
  const back = document.getElementById("cart-back");
  const message = document.getElementById("popup-status");

  resetCartPicker();
  dialog.dataset.state = state;
  heading.textContent = title;
  message.textContent = "";
  back.hidden = false;
  back.onclick = () => {
    resetCartPicker();
    dialog.dataset.state = "choose-list";
    heading.textContent = recipe.title;
    message.textContent = "";
    const choices = document.querySelectorAll("#popup-actions button");
    choices[state === "new" ? 1 : 0].focus();
  };
  dialog.scrollTop = 0;
}

function showExistingCarts(recipe) {
  const dialog = document.getElementById("recipe-popup");
  const back = document.getElementById("cart-back");
  const list = document.getElementById("cart-list");
  const message = document.getElementById("popup-status");
  const cartRecipe = recipeForCart(recipe);

  showCartView(recipe, "existing", "Add to Existing");
  document.getElementById("cart-recipe").textContent = "Choose a grocery list for “" + recipe.title + "”.";
  document.getElementById("cart-picker").hidden = false;
  list.replaceChildren();

  let carts;
  try {
    carts = readGroceryLists();
  } catch {
    message.textContent = "Grocery lists couldn't be loaded. Check browser storage and try again.";
    back.focus();
    return;
  }

  if (!carts.length) {
    const empty = document.createElement("li");
    empty.className = "cart-empty";
    empty.textContent = "No existing grocery lists found.";
    list.append(empty);
  }

  carts.forEach(cart => {
    const row = document.createElement("li");
    const name = document.createElement("span");
    name.className = "cart-name";
    name.textContent = cart.name;
    const count = document.createElement("small");
    count.textContent = cart.ingredients.length + " ingredients";
    name.append(count);

    const add = document.createElement("button");
    add.type = "button";
    add.className = "cart-add";
    add.textContent = "+";
    add.setAttribute("aria-label", "Add " + recipe.title + " to " + cart.name);
    add.onclick = () => {
      if (!cartRecipe.ingredients.length) {
        message.textContent = "This recipe has no ingredient list to add.";
        return;
      }
      try {
        const result = addRecipeToGroceryList(cart.id, cartRecipe);
        const notice = document.getElementById("cart-notice");
        notice.textContent = result.alreadyAdded
          ? recipe.title + " is already in “" + result.list.name + "”."
          : "Ingredients from " + recipe.title + " added to “" + result.list.name + "”.";
        dialog.close();
      } catch {
        message.textContent = "Couldn't save to this grocery list. Go back and try again.";
      }
    };
    row.append(name, add);
    list.append(row);
  });

  dialog.scrollTop = 0;
  (list.querySelector("button") || back).focus();
}

function showNewCart(recipe) {
  const dialog = document.getElementById("recipe-popup");
  const form = document.getElementById("new-cart-form");
  const title = document.getElementById("cart-title");
  const description = document.getElementById("cart-description");
  const message = document.getElementById("popup-status");
  const submit = form.querySelector("button[type='submit']");

  showCartView(recipe, "new", "Create New");
  form.reset();
  form.hidden = false;
  document.getElementById("new-cart-recipe").textContent = "Ingredients from “" + recipe.title + "” will be added to this list.";
  title.setCustomValidity("");
  title.oninput = () => title.setCustomValidity("");
  form.onsubmit = event => {
    event.preventDefault();
    if (!title.value.trim()) {
      title.setCustomValidity("Enter a title for your grocery list.");
      title.reportValidity();
      return;
    }

    submit.disabled = true;
    message.textContent = "";
    try {
      const cart = createGroceryList(title.value, description.value, recipeForCart(recipe));
      document.getElementById("cart-notice").textContent = "Created “" + cart.name + "” with ingredients from " + recipe.title + ".";
      dialog.close();
    } catch {
      message.textContent = "This list couldn't be saved. Please try again.";
    } finally {
      submit.disabled = false;
    }
  };
  title.focus();
}
