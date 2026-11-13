// Sample recipes for the prototype. Photo placeholders follow the paper design.
const recipes = [
  { id: 'pasta', title: 'Tomato Basil Pasta', time: '25 min', servings: '2 servings', description: 'A simple pasta with fresh tomatoes, basil, and a little Parmesan.', ingredients: ['200 g pasta', '2 cups cherry tomatoes', '2 cloves garlic', '2 tbsp olive oil', '¼ cup fresh basil', '¼ cup grated Parmesan'], steps: ['Cook the pasta in salted water until al dente.', 'Heat olive oil in a pan. Add minced garlic and tomatoes; cook until the tomatoes soften.', 'Toss with the drained pasta, basil, and Parmesan. Season to taste.'] },
  { id: 'chicken', title: 'Lemon Herb Chicken', time: '35 min', servings: '2 servings', description: 'Pan-seared chicken with lemon, garlic, and herbs. Serve with your favorite vegetables.', ingredients: ['2 chicken breasts', '1 lemon', '2 cloves garlic', '1 tbsp olive oil', '1 tsp dried oregano', 'Salt and pepper'], steps: ['Season the chicken with oregano, salt, and pepper.', 'Heat the olive oil and cook the chicken for 6–8 minutes per side, until its center reaches 165°F (74°C).', 'Add minced garlic and lemon juice, spoon the sauce over the chicken, and serve.'] },
  { id: 'salad', title: 'Garden Veggie Salad', time: '15 min', servings: '2 servings', description: 'A crisp, colorful salad with a simple lemon and olive oil dressing.', ingredients: ['4 cups mixed greens', '1 cucumber', '1 cup cherry tomatoes', '½ red onion', '2 tbsp olive oil', '1 tbsp lemon juice'], steps: ['Wash the greens and chop the cucumber, tomatoes, and onion.', 'Whisk together the olive oil and lemon juice.', 'Toss the vegetables with the dressing and season to taste.'] }
];
const content = document.querySelector('#content');
const storageKey = 'meal-max-grocery-lists';
let lists;
let storageAvailable = true;
let pendingNotice = '';
try {
  lists = JSON.parse(localStorage.getItem(storageKey) || 'null');
} catch { storageAvailable = false; }
if (!Array.isArray(lists)) lists = [];
lists = lists.filter(list => list && typeof list.id === 'string' && typeof list.title === 'string' && Array.isArray(list.items));

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const back = href => `<a class="back" href="${href}" aria-label="Go back">←</a>`;
const photo = className => `<div class="photo ${className}" role="img" aria-label="Recipe photo placeholder">Photo</div>`;
const recipeUrl = recipe => `#recipe/${recipe.id}`;

function saveLists() {
  try { localStorage.setItem(storageKey, JSON.stringify(lists)); }
  catch { storageAvailable = false; }
}

function addIngredients(list, recipe) {
  const existing = new Set(list.items.map(item => String(item).toLowerCase()));
  recipe.ingredients.forEach(item => {
    if (!existing.has(item.toLowerCase())) { list.items.push(item); existing.add(item.toLowerCase()); }
  });
  saveLists();
}

function render() {
  const [view, id] = location.hash.slice(1).split('/');
  const recipe = recipes.find(item => item.id === id);
  if (!recipe || !['recipe', 'ingredients', 'existing', 'new'].includes(view)) {
    content.innerHTML = `${back('home-page.html')}<h1>MY SAVED RECIPES</h1>
      <div class="recipe-list">${recipes.map(item => `<button class="recipe-row" data-recipe="${item.id}" aria-label="Open ${escapeHtml(item.title)}">
        ${photo('thumbnail')}<span class="recipe-copy"><strong>${escapeHtml(item.title)}</strong><small>${item.time}<br>${item.servings}</small></span><span class="chevron" aria-hidden="true">›</span>
      </button>`).join('')}</div>`;
    content.querySelectorAll('[data-recipe]').forEach(button => button.addEventListener('click', () => { location.hash = `recipe/${button.dataset.recipe}`; }));
  } else if (view === 'recipe' || view === 'ingredients') {
    content.innerHTML = `${back(view === 'ingredients' ? recipeUrl(recipe) : '#')}<article class="panel">
      <div class="panel-body"><p class="eyebrow">My Saved Recipes</p><h1 class="detail-title">${recipe.title}</h1>
      ${photo('large-photo')}<p class="muted">${recipe.time} · ${recipe.servings}</p><p class="description">${recipe.description}</p>
      <h3>Ingredients</h3><ul class="ingredients">${recipe.ingredients.map(item => `<li>${item}</li>`).join('')}</ul>
      <h3>Directions</h3><ol class="steps">${recipe.steps.map(step => `<li>${step}</li>`).join('')}</ol></div>
      ${view === 'ingredients' ? `<div class="choices"><button id="existing">Add to<br>existing</button><button id="new">Create<br>new</button></div>` : '<button class="action" id="add">Add Ingredients <span class="plus" aria-hidden="true">+</span></button>'}
      </article>`;
    if (view === 'recipe') document.querySelector('#add').onclick = () => { location.hash = `ingredients/${id}`; };
    else {
      document.querySelector('#existing').onclick = () => { location.hash = `existing/${id}`; };
      document.querySelector('#new').onclick = () => { location.hash = `new/${id}`; };
    }
  } else if (view === 'existing') {
    content.innerHTML = `${back(`#ingredients/${id}`)}<section class="panel"><div class="panel-body"><h2>Add to existing</h2>
      <div class="list-options">${lists.map((list, index) => `<button class="list-option" data-list="${index}" aria-label="Add ingredients to ${escapeHtml(list.title)}"><span>${escapeHtml(list.title)}<small>${list.items.length} ingredients</small></span><span class="plus" aria-hidden="true">+</span></button>`).join('')}</div>
      ${lists.length ? '' : '<p class="muted">No grocery lists yet. Create a new list to add these ingredients.</p><button class="list-option" id="create-first">Create new <span class="plus" aria-hidden="true">+</span></button>'}
      <p class="notice" role="status" id="notice"></p></div></section>`;
    document.querySelector('#notice').textContent = pendingNotice;
    pendingNotice = '';
    content.querySelectorAll('[data-list]').forEach(button => button.onclick = () => {
      const list = lists[Number(button.dataset.list)];
      addIngredients(list, recipe);
      button.querySelector('small').textContent = `${list.items.length} ingredients`;
      document.querySelector('#notice').textContent = `Ingredients added to “${list.title}”.${storageAvailable ? ' Saved on this device.' : ' Storage is unavailable; this list is kept for this session only.'}`;
    });
    const createFirst = document.querySelector('#create-first');
    if (createFirst) createFirst.onclick = () => { location.hash = `new/${id}`; };
  } else {
    content.innerHTML = `${back(`#ingredients/${id}`)}<form class="panel" id="new-list"><div class="panel-body"><h2>Create new</h2>
      <label for="list-title">Title:</label><input id="list-title" name="title" required maxlength="80" autocomplete="off" />
      <label for="list-notes">Notes:</label><textarea id="list-notes" name="notes" maxlength="1000"></textarea>
      <p class="muted">The ingredients from ${recipe.title} will be added to your new list.</p>
      <button class="action form-submit" type="submit" aria-label="Create grocery list and add ingredients">Create list <span class="plus" aria-hidden="true">+</span></button>
      <p class="notice" id="notice" role="status"></p></div></form>`;
    document.querySelector('#new-list').onsubmit = event => {
      event.preventDefault();
      const titleInput = document.querySelector('#list-title');
      if (!titleInput.value.trim()) { titleInput.setCustomValidity('Enter a list title.'); titleInput.reportValidity(); return; }
      const list = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title: titleInput.value.trim(), notes: document.querySelector('#list-notes').value.trim(), items: [] };
      lists.push(list);
      addIngredients(list, recipe);
      pendingNotice = `“${list.title}” created with ${list.items.length} ingredients.${storageAvailable ? ' Saved on this device.' : ' Storage is unavailable; this list is kept for this session only.'}`;
      location.hash = `existing/${id}`;
    };
    document.querySelector('#list-title').oninput = event => event.target.setCustomValidity('');
  }
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);
render();
