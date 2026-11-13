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
const groceryLists = [
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