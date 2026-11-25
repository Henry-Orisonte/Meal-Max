"use strict";

// Shared search rules: all text terms and all supplied limits must match.
const nutritionFields = ["protein", "fat", "calories"];

function filterRecipes(recipes, text, limits) {
  const terms = text.trim().toLowerCase().split(/[\s,]+/).filter(Boolean);
  return recipes.filter(recipe => {
    const searchable = [recipe.title, ...recipe.ingredients, recipe.cuisine, ...recipe.diets]
      .join(" ").toLowerCase();
    return terms.every(term => searchable.includes(term)) && nutritionFields.every(field => {
      const { min, max } = limits[field];
      if (min === null && max === null) return true;
      const value = recipe.nutrition?.[field];
      return Number.isFinite(value) && (min === null || value >= min) && (max === null || value <= max);
    });
  });
}
