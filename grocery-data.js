// Placeholder data

// Store names
const SAFEWAY = 'Safeway';
const TRADER_JOES = "Trader Joe's";
const WHOLE_FOODS = 'Whole Foods';
const WALMART = 'Walmart';
const COSTCO = 'Costco';
const TARGET = 'Target';
const ALDI = 'Aldi';
 
// Every ingredient lists the 3 stores it can be found at
const defaultGroceryLists = [
  {
    id: 1,
    name: 'Weeknight Pasta',
    ingredients: [
      { name: 'Spaghetti', quantity: '1 lb', stores: [SAFEWAY, WALMART, COSTCO] },
      { name: 'Marinara sauce', quantity: '1 jar', stores: [TRADER_JOES, SAFEWAY, TARGET] },
      { name: 'Garlic', quantity: '4 cloves', stores: [WHOLE_FOODS, SAFEWAY, ALDI] },
      { name: 'Parmesan', quantity: '1 cup', stores: [TRADER_JOES, WHOLE_FOODS, COSTCO] },
      { name: 'Fresh basil', quantity: '1 bunch', stores: [WHOLE_FOODS, TRADER_JOES, SAFEWAY] },
      { name: 'Olive oil', quantity: '1 bottle', stores: [COSTCO, WALMART, TRADER_JOES] },
      { name: 'Red pepper flakes', quantity: '1 jar', stores: [SAFEWAY, TARGET, WALMART] },
      { name: 'Italian sausage', quantity: '1 lb', stores: [SAFEWAY, WHOLE_FOODS, COSTCO] },
    ],
  },
  {
    id: 2,
    name: 'Taco Tuesday',
    ingredients: [
      { name: 'Ground beef', quantity: '1 lb', stores: [COSTCO, SAFEWAY, WALMART] },
      { name: 'Taco shells', quantity: '12', stores: [WALMART, TARGET, ALDI] },
      { name: 'Shredded cheese', quantity: '2 cups', stores: [COSTCO, ALDI, SAFEWAY] },
      { name: 'Lettuce', quantity: '1 head', stores: [SAFEWAY, TRADER_JOES, WHOLE_FOODS] },
      { name: 'Salsa', quantity: '1 jar', stores: [TRADER_JOES, WALMART, TARGET] },
      { name: 'Sour cream', quantity: '1 tub', stores: [SAFEWAY, ALDI, TARGET] },
      { name: 'Limes', quantity: '3', stores: [WALMART, SAFEWAY, COSTCO] },
    ],
  },
  {
    id: 3,
    name: 'Weekend Brunch',
    ingredients: [
      { name: 'Eggs', quantity: '1 dozen', stores: [ALDI, COSTCO, SAFEWAY] },
      { name: 'Bacon', quantity: '1 package', stores: [COSTCO, SAFEWAY, TRADER_JOES] },
      { name: 'Sourdough bread', quantity: '1 loaf', stores: [WHOLE_FOODS, SAFEWAY, TRADER_JOES] },
      { name: 'Avocados', quantity: '3', stores: [TRADER_JOES, COSTCO, WALMART] },
    ],
  },
  {
    id: 4,
    name: 'Healthy Salads',
    ingredients: [
      { name: 'Mixed greens', quantity: '2 bags', stores: [TRADER_JOES, COSTCO, WHOLE_FOODS] },
      { name: 'Cherry tomatoes', quantity: '1 pint', stores: [SAFEWAY, WHOLE_FOODS, ALDI] },
      { name: 'Cucumber', quantity: '2', stores: [ALDI, WALMART, SAFEWAY] },
      { name: 'Chickpeas', quantity: '2 cans', stores: [TRADER_JOES, WALMART, TARGET] },
      { name: 'Feta cheese', quantity: '1 block', stores: [WHOLE_FOODS, TRADER_JOES, COSTCO] },
    ],
  },
  {
    id: 5,
    name: 'Smoothie Week',
    ingredients: [
      { name: 'Bananas', quantity: '6', stores: [ALDI, TRADER_JOES, SAFEWAY] },
      { name: 'Frozen berries', quantity: '2 bags', stores: [COSTCO, TRADER_JOES, WALMART] },
      { name: 'Greek yogurt', quantity: '1 tub', stores: [COSTCO, TARGET, SAFEWAY] },
      { name: 'Spinach', quantity: '1 bag', stores: [TRADER_JOES, ALDI, WHOLE_FOODS] },
    ],
  },
  {
    id: 6,
    name: 'Sunday Roast',
    ingredients: [
      { name: 'Whole chicken', quantity: '1', stores: [COSTCO, SAFEWAY, WHOLE_FOODS] },
      { name: 'Potatoes', quantity: '2 lbs', stores: [ALDI, WALMART, SAFEWAY] },
      { name: 'Carrots', quantity: '1 lb', stores: [COSTCO, TRADER_JOES, ALDI] },
      { name: 'Fresh rosemary', quantity: '1 bunch', stores: [WHOLE_FOODS, TRADER_JOES, SAFEWAY] },
    ],
  },
];
 
// All grocery pages and the saved recipe picker use the same stored lists.
const GROCERY_LISTS_KEY = 'mealmax-grocery-lists';

function readGroceryLists() {
  const stored = localStorage.getItem(GROCERY_LISTS_KEY);
  if (stored === null) return structuredClone(defaultGroceryLists);

  const lists = JSON.parse(stored);
  if (!Array.isArray(lists) || lists.some(list =>
    !list || !Number.isInteger(list.id) || typeof list.name !== 'string' ||
    !Array.isArray(list.ingredients)
  )) {
    throw new Error('Grocery lists could not be read.');
  }
  return lists;
}

let groceryLists;
try {
  groceryLists = readGroceryLists();
} catch {
  groceryLists = structuredClone(defaultGroceryLists);
}

function groceryIngredient(text) {
  const parts = text.match(/^([\d¼½¾⅓⅔⅛⅜⅝⅞]+(?:\s+(?:g|kg|ml|l|cups?|tbsp|tsp|cans?|bunch(?:es)?))?)\s+(.+)$/i);
  return {
    name: parts ? parts[2] : text,
    quantity: parts ? parts[1] : 'to taste',
    // Store choices are sample data, like the lists above.
    stores: [SAFEWAY, WHOLE_FOODS, WALMART],
  };
}

function recipeGroceryIngredients(recipe) {
  if (!Array.isArray(recipe.ingredients) || !recipe.ingredients.length ||
      recipe.ingredients.some(ingredient => typeof ingredient !== 'string' || !ingredient.trim())) {
    throw new Error('This recipe has no ingredients to add.');
  }
  return recipe.ingredients.map(groceryIngredient);
}

function saveGroceryLists(lists) {
  // Only update the page's data after the browser has saved successfully.
  localStorage.setItem(GROCERY_LISTS_KEY, JSON.stringify(lists));
  groceryLists = lists;
}

function removeGroceryIngredient(listId, ingredientIndex) {
  const lists = readGroceryLists();
  const list = lists.find(item => item.id === listId);
  if (!list) throw new Error('This grocery list no longer exists.');
  if (!Number.isInteger(ingredientIndex) || ingredientIndex < 0 ||
      ingredientIndex >= list.ingredients.length) {
    throw new Error('This grocery list item no longer exists.');
  }

  list.ingredients.splice(ingredientIndex, 1);
  saveGroceryLists(lists);
}

function createGroceryList(title, description, recipe) {
  const name = title.trim();
  if (!name || name.length > 80 || description.length > 1000) {
    throw new Error('Enter a title and a shorter description.');
  }

  const lists = readGroceryLists();
  const list = {
    id: Math.max(0, ...lists.map(item => item.id)) + 1,
    name,
    description: description.trim(),
    ingredients: recipeGroceryIngredients(recipe),
    recipes: [{ id: recipe.id, title: recipe.title }],
  };
  saveGroceryLists([...lists, list]);
  return list;
}

function addRecipeToGroceryList(listId, recipe) {
  // Read again so adding a recipe preserves changes made in another tab.
  const lists = readGroceryLists();
  const list = lists.find(item => item.id === listId);
  if (!list) throw new Error('This grocery list no longer exists. Choose another list.');
  const ingredients = recipeGroceryIngredients(recipe);

  const addedRecipes = list.recipes || [];
  if (addedRecipes.some(item => item.title === recipe.title)) {
    return { list, alreadyAdded: true };
  }

  const ingredientKey = item => (item.name + '|' + item.quantity).toLowerCase().trim();
  const existing = new Set(list.ingredients.map(ingredientKey));
  ingredients.forEach(ingredient => {
    const key = ingredientKey(ingredient);
    if (!existing.has(key)) {
      list.ingredients.push(ingredient);
      existing.add(key);
    }
  });
  list.recipes = [...addedRecipes, { id: recipe.id, title: recipe.title }];

  saveGroceryLists(lists);
  return { list, alreadyAdded: false };
}

// Chosen store per ingredient
// Remembers stores for persistent selection (important for routing)
// { [listId]: { [ingredientName]: storeIndex } }
const STORE_CHOICES_KEY = 'mealmax-store-choices';
 
let storeChoices = (function () {
  try {
    return JSON.parse(localStorage.getItem(STORE_CHOICES_KEY)) || {};
  } catch (e) {
    return {};
  }
})();
 
// First store is the default. Index is 0 to 2
function getStoreIndex(listId, ingredientName) {
  const saved = storeChoices[listId] && storeChoices[listId][ingredientName];
  return Number.isInteger(saved) ? saved : 0;
}
 
function setStoreIndex(listId, ingredientName, index) {
  storeChoices[listId] = storeChoices[listId] || {};
  storeChoices[listId][ingredientName] = index;
  try {
    localStorage.setItem(STORE_CHOICES_KEY, JSON.stringify(storeChoices));
  } catch (e) {

  }
}
