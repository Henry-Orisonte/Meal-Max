const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(readFileSync('next-meal-data.js', 'utf8') + '\n' + readFileSync('recipe-search.js', 'utf8') + '\nthis.search = filterRecipes; this.recipes = nextMealRecipes;', context);

const limits = overrides => ({
  protein: { min: null, max: null },
  fat: { min: null, max: null },
  calories: { min: null, max: null },
  ...overrides
});
const search = (text = '', overrides = {}) => Array.from(context.search(context.recipes, text, limits(overrides)), recipe => recipe.id);

test('empty search returns all recipes; text matches ingredients, cuisine and diet', () => {
  assert.deepEqual(search(), [1, 2, 3, 4, 5]);
  assert.deepEqual(search('  SALMON, garlic '), [1]);
  assert.deepEqual(search('vegan ginger'), [3]);
  assert.deepEqual(search('italian'), [2]);
  assert.deepEqual(search('unmatched'), []);
});

test('each nutrient supports inclusive lower and upper bounds', () => {
  assert.deepEqual(search('', { protein: { min: 30, max: null } }), [1, 2]);
  assert.deepEqual(search('', { fat: { min: null, max: 15 } }), [3]);
  assert.deepEqual(search('', { calories: { min: 480, max: 620 } }), [1, 3]);
  assert.deepEqual(search('', { protein: { min: 40, max: 40 } }), [1]);
  assert.deepEqual(search('', { fat: { min: 28, max: 30 } }), [4, 5]);
  assert.deepEqual(search('', { calories: { min: 700, max: null } }), [2, 5]);
});

test('search terms and nutrition limits combine rather than replacing one another', () => {
  assert.deepEqual(search('garlic', {
    protein: { min: 30, max: null },
    fat: { min: null, max: 40 },
    calories: { min: null, max: 650 }
  }), [1]);
  assert.deepEqual(search('chicken', { fat: { min: null, max: 15 } }), []);
});

test('zero is a real bound and unknown nutrition cannot satisfy an active filter', () => {
  assert.deepEqual(search('', { calories: { min: null, max: 0 } }), []);
  const recipe = { ...context.recipes[0], nutrition: undefined };
  assert.equal(context.search([recipe], '', limits()).length, 1);
  assert.equal(context.search([recipe], '', limits({ protein: { min: 0, max: null } })).length, 0);
});
