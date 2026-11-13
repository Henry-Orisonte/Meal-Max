// Sample recipes for the Next Meal results page.
const nextMealRecipes = [
  {
    id: 1,
    title: "Garlic Butter Salmon",
    description: "Pan-seared salmon fillets finished in a rich lemon garlic herb butter sauce. Served alongside oven-roasted asparagus spears and crispy seasoned baby potatoes for a balanced weeknight dinner.",
    summary: "Lemon garlic salmon with roasted asparagus and baby potatoes.",
    photo: "assets/recipes/salmon.jpg",
    time: 35,
    servings: 2,
    cuisine: "american",
    diets: [],
    ingredients: [
      "2 salmon fillets",
      "300 g baby potatoes, halved",
      "1 bunch asparagus, trimmed",
      "2 tbsp butter",
      "2 garlic cloves, minced",
      "1 lemon",
      "1 tbsp olive oil",
      "1 tbsp chopped parsley",
      "Salt and black pepper"
    ],
    directions: [
      "Heat the oven to 425°F (220°C). Toss potatoes with half the olive oil, salt, and pepper. Roast for 20 minutes, then add asparagus and roast for 10 more minutes.",
      "Season the salmon. Heat the remaining oil in a skillet and sear the fillets for 4–5 minutes per side, until cooked through.",
      "Reduce the heat and add butter, garlic, and lemon juice. Spoon the sauce over the salmon, finish with parsley, and serve with the vegetables."
    ]
  },
  {
    id: 2,
    title: "Classic Chicken Alfredo",
    description: "Creamy homemade parmesan alfredo sauce tossed with al dente fettuccine pasta, sliced herb-seasoned grilled chicken breast, cracked black pepper, and fresh chopped Italian parsley.",
    summary: "Fettuccine and herb-seasoned chicken in a creamy Parmesan sauce.",
    photo: "assets/recipes/alfredo.jpg",
    time: 30,
    servings: 2,
    cuisine: "italian",
    diets: [],
    ingredients: [
      "200 g fettuccine",
      "2 small chicken breasts",
      "1 tbsp olive oil",
      "1 tbsp butter",
      "2 garlic cloves, minced",
      "¾ cup heavy cream",
      "½ cup grated Parmesan",
      "1 tbsp chopped parsley",
      "Salt and black pepper"
    ],
    directions: [
      "Cook the fettuccine according to its package instructions. Reserve half a cup of pasta water, then drain.",
      "Season the chicken. Heat olive oil in a skillet and cook the chicken for 6–8 minutes per side, until cooked through. Rest, then slice.",
      "Melt the butter in the skillet, add garlic, and cook briefly. Stir in cream and Parmesan over low heat until smooth.",
      "Toss the pasta in the sauce, adding a little pasta water to loosen it. Top with chicken, parsley, and black pepper."
    ]
  },
  {
    id: 3,
    title: "Veggie Teriyaki Stir Fry",
    description: "Crisp broccoli florets, sweet red bell peppers, julienned carrots, and snap peas wok-tossed in a savory homemade soy-ginger garlic glaze over fluffy steamed jasmine rice.",
    summary: "Colorful vegetables in a soy-ginger glaze over jasmine rice.",
    photo: "assets/recipes/stir-fry.jpg",
    time: 20,
    servings: 2,
    cuisine: "asian",
    diets: [
      "vegetarian",
      "vegan"
    ],
    ingredients: [
      "1 cup jasmine rice",
      "1 cup broccoli florets",
      "1 red bell pepper, sliced",
      "1 carrot, sliced thinly",
      "1 cup snap peas",
      "1 tbsp vegetable oil",
      "3 tbsp soy sauce",
      "1 tbsp maple syrup",
      "1 tsp grated ginger",
      "2 garlic cloves, minced",
      "1 tsp cornstarch mixed with 2 tbsp water"
    ],
    directions: [
      "Cook the rice according to its package instructions.",
      "Whisk together soy sauce, maple syrup, ginger, garlic, and the cornstarch mixture.",
      "Heat the oil in a wok or large skillet. Stir-fry the broccoli and carrot for 3 minutes, then add peppers and snap peas and cook for 3 more minutes.",
      "Pour in the sauce and toss until it thickens and coats the vegetables. Serve over rice."
    ]
  },
  {
    id: 4,
    title: "Spicy Black Bean Tacos",
    description: "Warm charred corn tortillas filled with cumin-spiced black beans, smoky roasted corn salsa, sliced ripe avocado, crumbled cotija cheese, fresh cilantro, and a squeeze of lime.",
    summary: "Cumin-spiced black beans, corn salsa, avocado, and cotija.",
    photo: "assets/recipes/tacos.jpg",
    time: 20,
    servings: 2,
    cuisine: "mexican",
    diets: [
      "vegetarian"
    ],
    ingredients: [
      "6 small corn tortillas",
      "1 can black beans, drained and rinsed",
      "1 cup corn kernels",
      "1 avocado, sliced",
      "¼ cup crumbled cotija cheese made with vegetarian rennet",
      "1 tsp ground cumin",
      "½ tsp smoked paprika",
      "1 tbsp olive oil",
      "1 lime",
      "2 tbsp chopped cilantro",
      "Salt and chili flakes to taste"
    ],
    directions: [
      "Heat half the oil in a skillet. Add the beans, cumin, paprika, and a splash of water. Simmer for 5 minutes and lightly mash some of the beans.",
      "In another pan, cook the corn in the remaining oil until lightly charred. Toss with lime juice and cilantro.",
      "Warm the tortillas in a dry skillet. Fill with beans and corn, then top with avocado, cotija, and chili flakes."
    ]
  },
  {
    id: 5,
    title: "Mediterranean Chickpea Bowl",
    description: "Fluffy herbed quinoa topped with crispy spiced roasted chickpeas, diced English cucumbers, sweet cherry tomatoes, kalamata olives, feta cheese, and a bright lemon tahini dressing.",
    summary: "Quinoa, roasted chickpeas, crunchy vegetables, and lemon tahini.",
    photo: "assets/recipes/chickpea-bowl.jpg",
    time: 30,
    servings: 2,
    cuisine: "mediterranean",
    diets: [
      "vegetarian"
    ],
    ingredients: [
      "¾ cup dry quinoa",
      "1 can chickpeas, drained and rinsed",
      "½ cucumber, diced",
      "1 cup cherry tomatoes, halved",
      "¼ cup kalamata olives",
      "¼ cup feta cheese made with vegetarian rennet",
      "2 tbsp tahini",
      "1 lemon",
      "1 tbsp olive oil",
      "½ tsp ground cumin",
      "2 tbsp chopped parsley",
      "Salt and black pepper"
    ],
    directions: [
      "Heat the oven to 425°F (220°C). Dry the chickpeas, toss with oil and cumin, and roast for 20–25 minutes until crisp.",
      "Meanwhile, cook quinoa according to its package instructions. Fluff and stir in the parsley.",
      "Whisk tahini with lemon juice and enough water to make a pourable dressing. Season to taste.",
      "Divide quinoa between bowls. Add chickpeas, cucumber, tomatoes, olives, and feta, then drizzle with dressing."
    ]
  }
];
