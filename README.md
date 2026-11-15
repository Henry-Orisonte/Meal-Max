# Meal Max

## Run locally

Requires Node.js/npm and Python 3. No dependency installation is needed.

```sh
npm run dev
```

Open http://localhost:3000 to view the site. `npm start` runs the same server.
Press Ctrl+C in the terminal to stop it. Changes to HTML files appear after
refreshing the browser.

## Saved recipes prototype

Open http://localhost:3000/saved-recipes-page.html, or choose **My Saved
Recipes** from the home page. Use the arrow beside a recipe to open its popup
with the same title and photo and the full description. **Add Ingredients**
splits into **Add to Existing** and **Create New**. Selecting an option updates
the popup state; transferring ingredients to a list is a future step.

The page uses five sample recipes with photos stored in `assets/recipes`.
The grocery list pages use sample data from `grocery-data.js`.

Photo sources: [salmon](https://images.unsplash.com/photo-1467003909585-2f8a72700288),
[Alfredo](https://www.themealdb.com/images/media/meals/uquqtu1511178042.jpg),
[vegetable stir fry](https://unsplash.com/photos/black-steel-wok-r8lDTtSWGUc),
[tacos](https://images.unsplash.com/photo-1551504734-5ee1c4a1479b), and
[chickpea bowl](https://images.unsplash.com/photo-1512621776951-a57141f2eefd).
Photos illustrate the sample dishes.

Contribution:

Scott: grocery list and saved recipe page, as well as grocery list image popups<br>
Will: grocery list page, detail page, and route calculation<br>
Priscilla: index, home page, and navigation bar<br>