export interface ApprovedRecipe {
  id: string;
  category: "Breakfast" | "Lunch" | "Dinner";
  name: string;
  ingredients: string[];
  optionalFlavorings: string[];
  directions: string;
  prepNotes: string;
  tags: string[];
}

export const APPROVED_RECIPES: ApprovedRecipe[] = [
  // BREAKFASTS
  {
    id: "b1",
    category: "Breakfast",
    name: "Egg & Turkey Breakfast Sandwich",
    ingredients: [
      "1 large egg",
      "100g egg whites",
      "2 slices whole grain bread",
      "75g deli turkey or back bacon",
      "1 large slice tomato",
      "30g avocado",
    ],
    optionalFlavorings: ["Dijon mustard", "Hot sauce"],
    directions:
      "Scramble the egg and egg whites. Add sliced turkey when the eggs are about 80% cooked. Mash the avocado and spread it on the bread. Add the eggs, turkey, tomato, and remaining ingredients. Add optional seasonings or sauces.",
    prepNotes: "Easy and fast. Turkey and sliced vegetables can be prepared ahead.",
    tags: ["High Protein", "Quick Prep", "< 10 min"],
  },
  {
    id: "b2",
    category: "Breakfast",
    name: "Easy Protein Oatmeal",
    ingredients: [
      "45g rolled oats",
      "150g 0% plain Greek yogurt",
      "15g whey protein",
      "60g blueberries or raspberries",
      "15g crushed walnuts",
    ],
    optionalFlavorings: ["Cinnamon", "Sugar-free maple syrup", "Zero-calorie coffee syrup"],
    directions:
      "Bring water to a boil and add oats. Reduce heat and simmer 5-7 minutes. Mix whey protein and Greek yogurt separately. Add the yogurt mixture, berries, and walnuts to the oats. Add optional flavorings.",
    prepNotes: "Frozen berries work well and reduce food waste.",
    tags: ["Fiber Rich", "Warm & Cozy", "Pre-mix Dry"],
  },
  {
    id: "b3",
    category: "Breakfast",
    name: "Peanut Butter Yogurt Bowl",
    ingredients: [
      "330g 0% plain Greek yogurt",
      "15g natural peanut butter",
      "150g blueberries",
      "20g chia seeds",
      "1 tsp maple syrup",
    ],
    optionalFlavorings: ["Cinnamon", "Lemon or lime juice", "Nutmeg"],
    directions:
      "Add Greek yogurt to a bowl. Add peanut butter. Top with blueberries and chia seeds. Add maple syrup. Add optional flavorings.",
    prepNotes: "No cooking required. Good choice for very low-prep plans.",
    tags: ["No Cook", "< 5 min", "High Protein"],
  },
  {
    id: "b4",
    category: "Breakfast",
    name: "Breakfast Burrito",
    ingredients: [
      "1 large egg",
      "150g egg whites",
      "1 whole grain tortilla",
      "45mL canned black beans (drained)",
      "30g salsa",
      "100g fruit on the side",
    ],
    optionalFlavorings: ["Lime juice", "Smoked paprika", "Cumin", "Nutritional yeast"],
    directions:
      "Scramble the egg and egg whites. Add black beans and salsa when the eggs are nearly cooked. Warm the tortilla about 30 seconds per side. Add the egg mixture to the tortilla and wrap. Serve with fruit.",
    prepNotes: "Tortillas and beans can be stored easily in the pantry.",
    tags: ["Portable", "Sustained Energy", "High Fiber"],
  },
  {
    id: "b5",
    category: "Breakfast",
    name: "Cottage Cheese Bowl",
    ingredients: [
      "290g low-fat cottage cheese",
      "200g frozen cherries",
      "20g natural peanut butter",
    ],
    optionalFlavorings: ["Cinnamon", "Zero-sugar coffee syrup", "Sea salt"],
    directions:
      "Warm cherries in the microwave or leave them frozen. Add cottage cheese to a bowl. Mix in cherries and peanut butter. Add optional flavorings.",
    prepNotes: "No stovetop cooking required.",
    tags: ["No Cook", "Sweet & Savory", "Quick"],
  },
  {
    id: "b6",
    category: "Breakfast",
    name: "Protein Pancakes",
    ingredients: [
      "230g low-fat cottage cheese",
      "50g rolled oats",
      "1 large egg",
      "125mL 1% milk",
      "1/2 tsp vanilla extract",
      "1/2 tsp cinnamon",
    ],
    optionalFlavorings: ["Frozen berries", "Zero-sugar syrup"],
    directions:
      "Blend all ingredients until smooth. Heat a non-stick pan or griddle over medium heat. Divide batter into about five pancakes. Cook about 3 minutes or until golden. Flip and cook the other side.",
    prepNotes: "Can be made ahead and reheated in a toaster.",
    tags: ["Batch Friendly", "Freezer Friendly", "Comfort Classic"],
  },
  {
    id: "b7",
    category: "Breakfast",
    name: "Cheesy Veggie Omelet & Toast",
    ingredients: [
      "1 large egg",
      "200g egg whites",
      "2 slices whole grain bread",
      "80g diced bell peppers",
      "70g mushrooms",
      "15g cheddar cheese",
    ],
    optionalFlavorings: ["Paprika", "Onion powder", "Garlic powder", "Hot sauce"],
    directions:
      "Sauté bell peppers and mushrooms. Add egg and egg whites. Cook until nearly finished. Add cheese and allow it to melt. Toast bread and serve alongside.",
    prepNotes: "Chop bell peppers and mushrooms during Sunday prep.",
    tags: ["Veggie Loaded", "Savory", "High Protein"],
  },
  {
    id: "b8",
    category: "Breakfast",
    name: "Berry Noire Overnight Oats",
    ingredients: [
      "135g 0% plain Greek yogurt",
      "35g rolled oats",
      "30g chocolate whey protein",
      "10g chia seeds",
      "60g blueberries",
      "10g dark chocolate (chopped)",
      "100mL almond milk",
      "1 tsp maple syrup",
    ],
    optionalFlavorings: ["Cinnamon", "Sugar-free pudding mix", "Zero-calorie syrup"],
    directions:
      "Combine oats, chia seeds, chocolate, and whey protein. Mix in Greek yogurt, almond milk, and maple syrup. Stir in blueberries. Refrigerate until ready to eat.",
    prepNotes: "Excellent make-ahead breakfast for grab-and-go mornings.",
    tags: ["Meal Prep", "Grab & Go", "Decadent & Healthy"],
  },

  // LUNCHES
  {
    id: "l1",
    category: "Lunch",
    name: "Chicken & Roasted Veggies",
    ingredients: [
      "105g cooked chicken breast",
      "150g cooked sweet potato",
      "150g Brussels sprouts",
      "1 tsp margarine",
      "1 tsp olive oil",
    ],
    optionalFlavorings: ["Smoked paprika", "Fresh parsley", "Rosemary", "Thyme", "Black pepper"],
    directions:
      "Preheat oven to 400°F. Cube sweet potato and chicken and halve Brussels sprouts. Toss with olive oil and seasoning. Roast 25-30 minutes. Add margarine after cooking.",
    prepNotes: "Very batch-friendly. Cook sweet potato and chicken in bulk.",
    tags: ["Batch Prep Champ", "Clean Carbs", "Balanced"],
  },
  {
    id: "l2",
    category: "Lunch",
    name: "Bison Taco Bowl",
    ingredients: [
      "145g cooked lean ground bison",
      "150g cooked quinoa",
      "1 tsp olive oil",
      "15g shredded cheddar cheese",
      "2 cups chopped romaine",
      "60g salsa",
    ],
    optionalFlavorings: ["Taco seasoning", "Cumin", "Lime juice", "Garlic powder", "Hot sauce"],
    directions:
      "Cook bison with seasoning. Combine romaine and cooked quinoa. Add bison and cheese. Add olive oil and salsa. Add optional flavorings.",
    prepNotes: "Quinoa and ground bison can be cooked for 3-4 days ahead.",
    tags: ["High Iron", "Nutrient Dense", "Satisfying"],
  },
  {
    id: "l3",
    category: "Lunch",
    name: "Turkey Burger",
    ingredients: [
      "1 hamburger bun",
      "170g ground turkey patty",
      "110g cooked russet potatoes",
      "Lettuce",
      "Tomato",
      "1 tbsp mustard",
      "1 tsp mayo",
    ],
    optionalFlavorings: ["Smoked paprika", "Onion powder", "Pickles"],
    directions:
      "Slice cooked potatoes and sauté until crisp. Season turkey patty. Cook until fully cooked through. Toast bun. Assemble with lettuce, tomato, mustard, and mayo.",
    prepNotes: "Turkey patties can be formed and refrigerated raw or pre-cooked.",
    tags: ["Comfort Food", "Crispy Potato Side", "Easy Assembly"],
  },
  {
    id: "l4",
    category: "Lunch",
    name: "BBQ Chicken Sandwich",
    ingredients: [
      "125g cooked chicken breast",
      "2 slices whole grain bread",
      "15g cheddar cheese",
      "Tomato",
      "Spinach",
      "150g fruit",
    ],
    optionalFlavorings: ["Low-sugar BBQ sauce", "Red pepper flakes", "Red wine vinegar"],
    directions:
      "Slice or shred cooked chicken. Toast bread if desired. Layer chicken, cheese, tomato, spinach, and BBQ sauce. Serve with fruit.",
    prepNotes: "Uses leftover pre-cooked chicken breast.",
    tags: ["Speedy Lunch", "< 5 min Assembly", "Leftover Friendly"],
  },
  {
    id: "l5",
    category: "Lunch",
    name: "Swiss Turkey Sandwich",
    ingredients: [
      "140g deli turkey",
      "2 slices whole grain bread",
      "15g Swiss cheese",
      "Lettuce",
      "Tomato",
      "1 tsp mayo",
      "150g fruit",
    ],
    optionalFlavorings: ["Dijon mustard", "Black pepper", "Oregano"],
    directions:
      "Spread mayo on bread. Add turkey, cheese, lettuce, and tomato. Toast if desired. Serve with fruit.",
    prepNotes: "One of the fastest lunch options with zero stovetop time.",
    tags: ["No Cook", "Ultra Fast", "Portable"],
  },
  {
    id: "l6",
    category: "Lunch",
    name: "Cajun Shrimp Sheet Pan",
    ingredients: [
      "135g cooked shrimp",
      "215g cooked mini potatoes",
      "200g mixed bell peppers",
      "40g sweet onion",
      "1 tbsp lime juice",
      "1 tbsp olive oil",
    ],
    optionalFlavorings: ["Cajun seasoning", "Hot sauce", "Cumin", "Smoked paprika"],
    directions:
      "Roast potatoes at 420°F until soft. Add peppers and onion and continue roasting. Add shrimp, remaining oil, and seasoning. Roast until shrimp is cooked. Finish with lime juice.",
    prepNotes: "Uses quick-cooking frozen shrimp and pre-boiled mini potatoes.",
    tags: ["Sheet Pan", "Flavor Bomb", "Lean Seafood"],
  },
  {
    id: "l7",
    category: "Lunch",
    name: "Chicken Avocado Wrap",
    ingredients: [
      "120g cooked chicken breast",
      "1 large whole grain tortilla",
      "Shredded lettuce",
      "30g avocado",
      "100g sliced bell pepper",
      "1 tsp mayo",
    ],
    optionalFlavorings: ["Lemon juice", "Hot sauce", "Mustard"],
    directions:
      "Spread mayo on tortilla. Add chicken, avocado, lettuce, and peppers. Fold and roll tightly. Optionally sear 1-2 minutes per side.",
    prepNotes: "Can be wrapped in foil for an on-the-go workday lunch.",
    tags: ["Work Lunch", "On The Go", "Fresh Crunch"],
  },
  {
    id: "l8",
    category: "Lunch",
    name: "Taco Salad",
    ingredients: [
      "115g cooked lean ground beef",
      "130mL canned black beans",
      "100g diced bell peppers",
      "20g avocado",
      "10g crushed whole grain tortilla chips",
    ],
    optionalFlavorings: ["Taco seasoning", "Lemon zest", "Hot sauce", "Garlic powder"],
    directions:
      "Heat beef, beans, and peppers. Transfer to a bowl. Add avocado. Top with crushed tortilla chips. Season as desired.",
    prepNotes: "Great way to use canned pantry beans and batch-cooked ground beef.",
    tags: ["Satisfying", "High Fiber", "Crunchy"],
  },

  // DINNERS
  {
    id: "d1",
    category: "Dinner",
    name: "Sheet Pan Balsamic Chicken",
    ingredients: [
      "110g cooked chicken breast",
      "190g cooked russet potatoes",
      "150g Brussels sprouts",
      "1 tsp olive oil",
      "1 tbsp balsamic vinegar",
    ],
    optionalFlavorings: ["Red pepper flakes", "Lemon zest", "Low-sodium soy sauce", "Herbs"],
    directions:
      "Sauté or reheat potatoes and Brussels sprouts with olive oil. Add chicken until warmed through. Add balsamic vinegar. Toss and season.",
    prepNotes: "Shares ingredients with Chicken & Roasted Veggies lunch.",
    tags: ["Overlapping Ingredients", "Sheet Pan", "Easy Cleanup"],
  },
  {
    id: "d2",
    category: "Dinner",
    name: "Steak & Rice Power Bowl",
    ingredients: [
      "120g cooked lean sirloin steak",
      "130g cooked brown rice",
      "120mL canned sweet corn",
      "50g spinach",
      "1 tsp olive oil",
    ],
    optionalFlavorings: ["Garlic", "Ginger", "Hot sauce", "Green onion"],
    directions:
      "Warm rice and corn. Stir in spinach until wilted. Slice steak and add to bowl. Toss with olive oil and seasonings.",
    prepNotes: "Cook brown rice in batch. Sirloin cooks in under 8 minutes.",
    tags: ["Hearty", "High Protein", "Warm Bowl"],
  },
  {
    id: "d3",
    category: "Dinner",
    name: "Honey Garlic Salmon",
    ingredients: [
      "130g cooked salmon",
      "130g cooked couscous",
      "150g roasted asparagus",
      "1 tbsp honey",
      "1 tsp olive oil",
    ],
    optionalFlavorings: ["Lemon zest", "Fresh dill", "Red pepper flakes"],
    directions:
      "Season and cook salmon until it flakes easily. Add honey glaze during the final minute. Warm couscous. Warm or sauté asparagus with olive oil. Serve together.",
    prepNotes: "Couscous takes only 5 minutes in boiled water.",
    tags: ["Healthy Fats (Omega-3)", "Quick Cooking", "Restaurant Quality"],
  },
  {
    id: "d4",
    category: "Dinner",
    name: "Dijon Pork Tenderloin",
    ingredients: [
      "145g cooked pork tenderloin",
      "180g baked sweet potato",
      "150g roasted green beans",
      "1 tsp olive oil",
    ],
    optionalFlavorings: ["Dijon mustard", "Red pepper flakes", "Lemon juice"],
    directions:
      "Season pork with salt, pepper, and Dijon. Cook until properly done. Bake cubed sweet potato. Roast green beans with olive oil. Serve together.",
    prepNotes: "Pork tenderloin is as lean as chicken breast and very tender.",
    tags: ["Lean Protein", "Satisfying", "Batch Roasting"],
  },
  {
    id: "d5",
    category: "Dinner",
    name: "Chicken & Cheese Quesadilla",
    ingredients: [
      "115g cooked chicken breast",
      "1 whole grain tortilla",
      "70g cooked quinoa",
      "15g shredded cheddar cheese",
      "60g salsa",
    ],
    optionalFlavorings: ["Cilantro", "Lime juice", "Hot sauce"],
    directions:
      "Cook and shred or cube chicken if needed. Prepare quinoa. Add cheese, chicken, quinoa, and salsa to half the tortilla. Fold tortilla. Toast in a dry pan until crisp and cheese is melted.",
    prepNotes: "Reuses pre-cooked chicken and batch-made quinoa.",
    tags: ["Crispy", "Fast Dinner", "Overlapping Ingredients"],
  },
  {
    id: "d6",
    category: "Dinner",
    name: "Ground Bison Spaghetti",
    ingredients: [
      "100g cooked lean ground bison",
      "110g cooked red lentil pasta",
      "140mL marinara sauce",
      "1 slice whole grain bread",
      "1 tsp olive oil",
      "5g parmesan cheese",
    ],
    optionalFlavorings: ["Zucchini", "Spinach", "Garlic powder"],
    directions:
      "Cook pasta and drain. Brown bison. Add marinara and heat. Toss pasta with bison and sauce. Serve with toasted bread and parmesan.",
    prepNotes: "Red lentil pasta adds 15g+ plant protein and high fiber.",
    tags: ["Comfort Food", "High Fiber Pasta", "Satisfying"],
  },
  {
    id: "d7",
    category: "Dinner",
    name: "Shrimp Pho",
    ingredients: [
      "125g cooked shrimp",
      "50g dry rice noodles",
      "240mL chicken broth",
      "50g onion",
      "1 tsp olive oil",
      "1 large egg",
    ],
    optionalFlavorings: ["Jalapeños", "Green onions", "Sriracha"],
    directions:
      "Sauté onion and shrimp. Add broth and bring to a boil. Add noodles and simmer 3-5 minutes. Serve in a bowl. Top with soft-boiled egg.",
    prepNotes: "Warm, light, hydrating evening soup.",
    tags: ["Broth Based", "Low Calorie", "Quick"],
  },
  {
    id: "d8",
    category: "Dinner",
    name: "Turkey Vegetable Hash",
    ingredients: [
      "170g cooked lean ground turkey",
      "170g cooked sweet potato",
      "50g roasted parsnips",
      "70g roasted bell peppers",
      "1 tsp olive oil",
    ],
    optionalFlavorings: ["Smoked paprika", "Hot sauce", "Lemon juice"],
    directions:
      "Cube sweet potato and parsnips and cook until tender. Brown turkey in olive oil. Add peppers, sweet potato, and parsnips. Sauté until vegetables are golden.",
    prepNotes: "Great 1-skillet dinner that uses pre-roasted root vegetables.",
    tags: ["One Pan", "Hearty Hash", "High Protein"],
  },
];

export const SYSTEM_PROMPT = `# ROLE
You are the **5-Day Meal Plan Coach**, a simple meal-planning assistant that helps users create an easy, tasty, high-protein 5-day meal plan.
Your goal is to make healthy eating feel realistic and easy to execute.
Each plan contains:
* 5 breakfasts
* 5 lunches
* 5 dinners

Use only the approved meals contained in the Knowledge files unless a substitution is required for an allergy, dietary restriction, or strong food preference.

# CORE PRINCIPLE
The user does not need more nutrition information.
They need a simple plan they can actually follow.
Optimize for:
**Taste + Nutrition + Simplicity + Speed + Repeatability**
Whenever possible, choose meals that:
* take approximately 30 minutes or less
* use common ingredients
* reuse ingredients across multiple meals
* can be partially batch-prepped
* require minimal cooking skill

Do not overwhelm the user.

# MEAL SELECTION
After receiving the user's intake answers, choose:
* 5 approved breakfasts
* 5 approved lunches
* 5 approved dinners
Select meals from the Knowledge files.
Do not invent new recipes simply to create variety.
Personalize the selection based primarily on:
* allergies
* dietary restrictions
* disliked foods
* cooking preference
* convenience
* ingredient overlap

When multiple meals are appropriate, favor combinations that reuse ingredients and reduce prep time.
Avoid unnecessary repetition of the exact same meal within the 5-day plan unless repetition clearly makes the plan easier.

# PORTIONS
Use the ingredient quantities contained in the official recipes as the default portions.
Do not pretend to calculate medically precise portions from age, height, weight, sex, or activity level.
You may provide simple portion guidance when helpful, but avoid false precision.
If the user asks for calories or macronutrients, explain that values are approximate.
Do not turn the standard experience into calorie tracking unless the user specifically requests it.

# PERSONALIZED INTRODUCTION
Before presenting the plan, provide a short 2-4 sentence summary explaining how the plan was selected.
Reference relevant preferences when useful.

# OUTPUT STRUCTURE
Use this structure clearly:

# Your 5-Day Meal Plan

## Day 1
### Breakfast — [Meal Name]
**Why you'll like it:** [1 short sentence]
**Why it works:** [1-2 simple sentences]
**What you need:**
[List ingredients and quantities from recipe]
**Make it:**
[Concise instructions]
**Make it easier:**
[1 useful shortcut or tip]

### Lunch — [Meal Name]
[Same format]

### Dinner — [Meal Name]
[Same format]

Repeat through Day 5.

# Prep Once, Eat Faster
Identify preparation that can reduce cooking during the five days across the selected meals (e.g. batch chicken, sweet potatoes, grains, chopped peppers). List 4-8 concrete prep actions with which days/meals they support.

# Your 5-Day Grocery List
Include ONLY ingredients needed for the user's selected meals. Combine duplicate ingredients into practical shopping quantities.
Organize into:
* Protein
* Produce
* Dairy / Refrigerated
* Carbs / Grains
* Pantry / Sauces
* Flavor / Seasonings

# SUBSTITUTIONS
Preserve the official recipes whenever possible. When a substitution is necessary, choose one that serves a similar role in the meal.

# APPROVED MEAL DATABASE
${APPROVED_RECIPES.map(
  (r) => `
[${r.category.toUpperCase()}] ${r.name}
Ingredients: ${r.ingredients.join(", ")}
Optional: ${r.optionalFlavorings.join(", ")}
Directions: ${r.directions}
Prep Notes: ${r.prepNotes}
`
).join("\n")}

# PREP & GROCERY CONSOLIDATION RULES
- Look across all 15 selected meals.
- Recommend batch-cooking repeated proteins (e.g., chicken breasts, turkey, ground bison), grains (brown rice, quinoa), and roasted potatoes/sweet potatoes.
- Combine overlapping ingredients into single grocery lines with practical purchase quantities (e.g. 1 loaf whole grain bread, 1 package tortillas, total estimated chicken weight).
- Keep grocery list categorized strictly into: Protein, Produce, Dairy / Refrigerated, Carbs / Grains, Pantry / Sauces, Flavor / Seasonings.
- Tone: encouraging, practical, concise, zero moralizing or guilt.`;
