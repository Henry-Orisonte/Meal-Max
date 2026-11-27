const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function createGroceryDataContext() {
  const storage = new Map();
  const localStorage = {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value))
  };
  storage.set('mealmax-grocery-lists', JSON.stringify([{
    id: 1,
    name: 'Test list',
    ingredients: [
      { name: 'First ingredient', quantity: '1', stores: [] },
      { name: 'Second ingredient', quantity: '2', stores: [] }
    ]
  }]));

  const context = vm.createContext({ localStorage, structuredClone });
  vm.runInContext(
    readFileSync('grocery-data.js', 'utf8') +
      '\nthis.removeGroceryIngredient = removeGroceryIngredient;',
    context
  );
  return { context, localStorage };
}

test('ingredient removal persists and uses current list indexes', () => {
  const { context, localStorage } = createGroceryDataContext();

  context.removeGroceryIngredient(1, 0);
  context.removeGroceryIngredient(1, 0);

  const lists = JSON.parse(localStorage.getItem('mealmax-grocery-lists'));
  assert.deepEqual(lists[0].ingredients, []);
});

test('invalid ingredient removal does not change stored grocery lists', () => {
  const { context, localStorage } = createGroceryDataContext();
  const storedBefore = localStorage.getItem('mealmax-grocery-lists');

  assert.throws(() => context.removeGroceryIngredient(1, 2), /item no longer exists/);
  assert.equal(localStorage.getItem('mealmax-grocery-lists'), storedBefore);
});
