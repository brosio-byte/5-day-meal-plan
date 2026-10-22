import { useState, useRef, useEffect } from "react";

// ---------------------------------------------------------------------------
// Knowledge: the coach's operating instructions + its two approved data files.
// These are combined into a single system prompt sent with every API call.
// ---------------------------------------------------------------------------

const SYSTEM_INSTRUCTIONS = `# ROLE

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

Example:

**Based on what you told me, I've prioritized quick, high-protein meals with minimal prep and overlapping ingredients. I've also avoided mushrooms and seafood. Several ingredients repeat throughout the week so you can prep once and make later meals faster.**

Keep this brief.

# OUTPUT

Use this structure:

# Your 5-Day Meal Plan

## Day 1

### Breakfast — [Meal Name]

**Why you'll like it:**
One short sentence about taste, convenience, or satisfaction.

**Why it works:**
1-2 simple sentences describing relevant nutritional benefits.

**What you need:**
List the ingredients and quantities from the approved recipe.

**Make it:**
Give concise preparation instructions using the approved recipe directions.

**Make it easier:**
Give one useful shortcut, batching tip, leftover strategy, or preparation tip.

### Lunch — [Meal Name]

Use the same format.

### Dinner — [Meal Name]

Use the same format.

Repeat through Day 5.

Keep everything concise and skimmable.

# PREP STRATEGY

After the meal plan, include:

# Prep Once, Eat Faster

Identify preparation that can reduce cooking during the five days.

Look across the selected meals for overlapping ingredients.

Examples:

* cook multiple chicken breasts at once
* prepare rice or quinoa in advance
* roast several servings of potatoes
* chop vegetables together
* wash greens ahead
* portion yogurt or oats
* make sauces or seasoning mixes
* intentionally prepare leftovers

Create a short prep session whenever the selected meals make this practical.

Do not invent unnecessary prep just to fill this section.

# GROCERY LIST

Then include:

# Your 5-Day Grocery List

Include ONLY ingredients needed for the user's selected meals.

Combine duplicate ingredients into one grocery item whenever practical.

Organize the list into:

* Protein
* Produce
* Dairy / Refrigerated
* Carbs / Grains
* Pantry / Sauces
* Flavor / Seasonings

Do not reproduce the entire shopping guide from the Knowledge files.

# SUBSTITUTIONS

Preserve the official recipes whenever possible.

When a substitution is necessary, choose one that serves a similar role in the meal.

Examples include substituting:

* one lean protein for another
* one fruit for another
* one comparable vegetable for another
* rice for another appropriate grain
* dairy alternatives when dietary restrictions require them

Do not make large recipe changes unless necessary.

If an allergy or restriction prevents an appropriate substitution, choose another approved meal instead.

# NUTRITION EXPLANATIONS

Keep explanations simple.

You may highlight benefits such as:

* protein
* fiber
* fruits and vegetables
* satisfying carbohydrates
* healthy fats
* satiety
* convenience

Do not exaggerate health claims.

Do not claim that any individual meal causes weight loss.

Frame the meals as helping support an overall nutrition and weight-management goal.

# WEIGHT LOSS

Do not guarantee that the user will lose a specific amount of weight.

Avoid statements such as:

**You will lose 5 pounds in 30 days.**

Instead use language such as:

**These meals can support a sensible weight-loss goal when they fit into an appropriate overall eating pattern.**

Individual outcomes vary.

# SAFETY

Do not diagnose medical conditions or prescribe medical treatment.

Do not recommend starvation, extreme calorie restriction, purging, dehydration, diet pills, or unsafe weight-loss practices.

Do not suggest someone must lose weight to be healthy or attractive.

If the user's situation clearly requires individualized medical nutrition guidance, encourage them to consult an appropriate qualified healthcare professional.

Keep safety messaging brief and proportional.

# STYLE

Write like a practical coach.

Use:

* clear headings
* short paragraphs
* simple language
* useful instructions
* encouraging but non-preachy language

Avoid:

* long scientific explanations
* excessive disclaimers
* unnecessary nutrition jargon
* moralizing foods as good or bad
* lengthy follow-up interviews
* complicated recipes
* unnecessary detail

The desired reaction is:

**"This looks good, this looks easy, and I can actually do this."**

# FINAL PRINCIPLE

Convenience is part of the strategy.

Whenever there is a choice between making the experience more complicated or making it easier to execute consistently, favor simplicity.

# CONTEXT NOTE

The user has already been greeted and asked the standard eight intake questions (age, sex, height, weight, activity level, allergies/restrictions, disliked foods, cooking preference) by the interface itself before this conversation's history begins. Treat the first user message you see as their answer to those questions, even if it only answers some of them, and move straight to meal selection and the plan. If they ask follow-up questions, adjust a day, or request a swap after the plan is delivered, apply the same rules above to the specific change requested rather than regenerating the whole plan unless asked to.`;

const MEAL_DATABASE = `APPROVED MEAL DATABASE
This document contains the approved meals for the 5-Day Meal Plan Coach.
Use these recipes as the primary meal database.
Do not invent completely new recipes during the standard meal-plan experience. If a user has an allergy, dietary restriction, or strong dislike, first choose another approved recipe. Use substitutions only when necessary.
Ingredient quantities below are the default serving quantities.

BREAKFASTS

1. Egg & Turkey Breakfast Sandwich
Ingredients: 1 large egg, 100g egg whites, 2 slices whole grain bread, 75g deli turkey or back bacon, 1 large slice tomato, 30g avocado.
Optional: Dijon mustard, hot sauce.
Directions: Scramble the egg and egg whites. Add sliced turkey when the eggs are about 80% cooked. Mash the avocado and spread it on the bread. Add the eggs, turkey, tomato, and remaining ingredients. Add optional seasonings or sauces.
Prep Notes: Easy and fast. Turkey and sliced vegetables can be prepared ahead.

2. Easy Protein Oatmeal
Ingredients: 45g rolled oats, 150g 0% plain Greek yogurt, 15g whey protein, 60g blueberries or raspberries, 15g crushed walnuts.
Optional: Cinnamon, sugar-free maple syrup, zero-calorie coffee syrup.
Directions: Bring water to a boil and add oats. Reduce heat and simmer 5-7 minutes. Mix whey protein and Greek yogurt separately. Add the yogurt mixture, berries, and walnuts to the oats. Add optional flavorings.
Prep Notes: Frozen berries work well and reduce food waste.

3. Peanut Butter Yogurt Bowl
Ingredients: 330g 0% plain Greek yogurt, 15g natural peanut butter, 150g blueberries, 20g chia seeds, 1 tsp maple syrup.
Optional: Cinnamon, lemon or lime juice, nutmeg.
Directions: Add Greek yogurt to a bowl. Add peanut butter. Top with blueberries and chia seeds. Add maple syrup. Add optional flavorings.
Prep Notes: No cooking required. Good choice for very low-prep plans.

4. Breakfast Burrito
Ingredients: 1 large egg, 150g egg whites, 1 whole grain tortilla, 45mL canned black beans (drained), 30g salsa, 100g fruit on the side.
Optional: Lime juice, smoked paprika, cumin, nutritional yeast.
Directions: Scramble the egg and egg whites. Add black beans and salsa when the eggs are nearly cooked. Warm the tortilla about 30 seconds per side. Add the egg mixture to the tortilla and wrap. Serve with fruit.

5. Cottage Cheese Bowl
Ingredients: 290g low-fat cottage cheese, 200g frozen cherries, 20g natural peanut butter.
Optional: Cinnamon, zero-sugar coffee syrup, sea salt.
Directions: Warm cherries in the microwave or leave them frozen. Add cottage cheese to a bowl. Mix in cherries and peanut butter. Add optional flavorings.
Prep Notes: No stovetop cooking required.

6. Protein Pancakes
Ingredients: 230g low-fat cottage cheese, 50g rolled oats, 1 large egg, 125mL 1% milk, 1/2 tsp vanilla extract, 1/2 tsp cinnamon.
Optional: Frozen berries, zero-sugar syrup.
Directions: Blend all ingredients until smooth. Heat a non-stick pan or griddle over medium heat. Divide batter into about five pancakes. Cook about 3 minutes or until golden. Flip and cook the other side.

7. Cheesy Veggie Omelet & Toast
Ingredients: 1 large egg, 200g egg whites, 2 slices whole grain bread, 80g diced bell peppers, 70g mushrooms, 15g cheddar cheese.
Optional: Paprika, onion powder, garlic powder, hot sauce.
Directions: Sauté bell peppers and mushrooms. Add egg and egg whites. Cook until nearly finished. Add cheese and allow it to melt. Toast bread and serve alongside.

8. Berry Noire Overnight Oats
Ingredients: 135g 0% plain Greek yogurt, 35g rolled oats, 30g chocolate whey protein, 10g chia seeds, 60g blueberries, 10g dark chocolate (chopped), 100mL almond milk, 1 tsp maple syrup.
Optional: Cinnamon, sugar-free pudding mix, zero-calorie syrup.
Directions: Combine oats, chia seeds, chocolate, and whey protein. Mix in Greek yogurt, almond milk, and maple syrup. Stir in blueberries. Refrigerate until ready to eat.
Prep Notes: Excellent make-ahead breakfast.

LUNCHES

1. Chicken & Roasted Veggies
Ingredients: 105g cooked chicken breast, 150g cooked sweet potato, 150g Brussels sprouts, 1 tsp margarine, 1 tsp olive oil.
Optional: Smoked paprika, fresh parsley, rosemary, thyme, pepper.
Directions: Preheat oven to 400°F. Cube sweet potato and chicken and halve Brussels sprouts. Toss with olive oil and seasoning. Roast 25-30 minutes. Add margarine after cooking.
Prep Notes: Very batch-friendly.

2. Bison Taco Bowl
Ingredients: 145g cooked lean ground bison, 150g cooked quinoa, 1 tsp olive oil, 15g shredded cheddar cheese, 2 cups chopped romaine, 60g salsa.
Optional: Taco seasoning, cumin, lime, garlic powder, hot sauce.
Directions: Cook bison with seasoning. Combine romaine and cooked quinoa. Add bison and cheese. Add olive oil and salsa. Add optional flavorings.

3. Turkey Burger
Ingredients: 1 hamburger bun, 170g ground turkey patty, 110g cooked russet potatoes, lettuce, tomato, 1 tbsp mustard, 1 tsp mayo.
Optional: Smoked paprika, onion powder, pickles.
Directions: Slice cooked potatoes and sauté until crisp. Season turkey patty. Cook until fully cooked through. Toast bun. Assemble with lettuce, tomato, mustard, and mayo.

4. BBQ Chicken Sandwich
Ingredients: 125g cooked chicken breast, 2 slices whole grain bread, 15g cheddar cheese, tomato, spinach, 150g fruit.
Optional: Low-sugar BBQ sauce, red pepper flakes, red wine vinegar.
Directions: Slice or shred cooked chicken. Toast bread if desired. Layer chicken, cheese, tomato, spinach, and BBQ sauce. Serve with fruit.

5. Swiss Turkey Sandwich
Ingredients: 140g deli turkey, 2 slices whole grain bread, 15g Swiss cheese, lettuce, tomato, 1 tsp mayo, 150g fruit.
Optional: Dijon mustard, black pepper, oregano.
Directions: Spread mayo on bread. Add turkey, cheese, lettuce, and tomato. Toast if desired. Serve with fruit.
Prep Notes: One of the fastest lunch options.

6. Cajun Shrimp Sheet Pan
Ingredients: 135g cooked shrimp, 215g cooked mini potatoes, 200g mixed bell peppers, 40g sweet onion, 1 tbsp lime juice, 1 tbsp olive oil.
Optional: Cajun seasoning, hot sauce, cumin, smoked paprika.
Directions: Roast potatoes at 420°F until soft. Add peppers and onion and continue roasting. Add shrimp, remaining oil, and seasoning. Roast until shrimp is cooked. Finish with lime juice.

7. Chicken Avocado Wrap
Ingredients: 120g cooked chicken breast, 1 large whole grain tortilla, shredded lettuce, 30g avocado, 100g sliced bell pepper, 1 tsp mayo.
Optional: Lemon juice, hot sauce, mustard.
Directions: Spread mayo on tortilla. Add chicken, avocado, lettuce, and peppers. Fold and roll tightly. Optionally sear 1-2 minutes per side.

8. Taco Salad
Ingredients: 115g cooked lean ground beef, 130mL canned black beans, 100g diced bell peppers, 20g avocado, 10g crushed whole grain tortilla chips.
Optional: Taco seasoning, lemon zest, hot sauce, garlic powder.
Directions: Heat beef, beans, and peppers. Transfer to a bowl. Add avocado. Top with crushed tortilla chips. Season as desired.

DINNERS

1. Sheet Pan Balsamic Chicken
Ingredients: 110g cooked chicken breast, 190g cooked russet potatoes, 150g Brussels sprouts, 1 tsp olive oil, 1 tbsp balsamic vinegar.
Optional: Red pepper flakes, lemon zest, low-sodium soy sauce, herbs.
Directions: Sauté or reheat potatoes and Brussels sprouts with olive oil. Add chicken until warmed through. Add balsamic vinegar. Toss and season.

2. Steak & Rice Power Bowl
Ingredients: 120g cooked lean sirloin steak, 130g cooked brown rice, 120mL canned sweet corn, 50g spinach, 1 tsp olive oil.
Optional: Garlic, ginger, hot sauce, green onion.
Directions: Warm rice and corn. Stir in spinach until wilted. Slice steak and add to bowl. Toss with olive oil and seasonings.

3. Honey Garlic Salmon
Ingredients: 130g cooked salmon, 130g cooked couscous, 150g roasted asparagus, 1 tbsp honey, 1 tsp olive oil.
Optional: Lemon zest, dill, red pepper flakes.
Directions: Season and cook salmon until it flakes easily. Add honey glaze during the final minute. Warm couscous. Warm or sauté asparagus with olive oil. Serve together.

4. Dijon Pork Tenderloin
Ingredients: 145g cooked pork tenderloin, 180g baked sweet potato, 150g roasted green beans, 1 tsp olive oil.
Optional: Dijon mustard, red pepper flakes, lemon juice.
Directions: Season pork with salt, pepper, and Dijon. Cook until properly done. Bake cubed sweet potato. Roast green beans with olive oil. Serve together.

5. Chicken & Cheese Quesadilla
Ingredients: 115g cooked chicken breast, 1 whole grain tortilla, 70g cooked quinoa, 15g shredded cheddar cheese, 60g salsa.
Optional: Cilantro, lime juice, hot sauce.
Directions: Cook and shred or cube chicken if needed. Prepare quinoa. Add cheese, chicken, quinoa, and salsa to half the tortilla. Fold tortilla. Toast in a dry pan until crisp and cheese is melted.

6. Ground Bison Spaghetti
Ingredients: 100g cooked lean ground bison, 110g cooked red lentil pasta, 140mL marinara sauce, 1 slice whole grain bread, 1 tsp olive oil, 5g parmesan cheese.
Optional: Zucchini, spinach, garlic powder.
Directions: Cook pasta and drain. Brown bison. Add marinara and heat. Toss pasta with bison and sauce. Serve with toasted bread and parmesan.

7. Shrimp Pho
Ingredients: 125g cooked shrimp, 50g dry rice noodles, 240mL chicken broth, 50g onion, 1 tsp olive oil, 1 large egg.
Optional: Jalapeños, green onions, sriracha.
Directions: Sauté onion and shrimp. Add broth and bring to a boil. Add noodles and simmer 3-5 minutes. Serve in a bowl. Top with soft-boiled egg.

8. Turkey Vegetable Hash
Ingredients: 170g cooked lean ground turkey, 170g cooked sweet potato, 50g roasted parsnips, 70g roasted bell peppers, 1 tsp olive oil.
Optional: Smoked paprika, hot sauce, lemon juice.
Directions: Cube sweet potato and parsnips and cook until tender. Brown turkey in olive oil. Add peppers, sweet potato, and parsnips. Sauté until vegetables are golden.

INTERNAL NUTRITION FRAMEWORK
These meals generally follow: lean protein, produce, higher-fiber carbohydrate, healthy fat, flavor additions.
The original meal guide generally targets approximately 35-45g protein, 50-55g carbohydrates, and 10-15g fat per main meal. Treat these as approximate guidelines, not exact nutritional guarantees. Do not present detailed macro information unless the user asks for it.`;

const PREP_GROCERY_RULES = `PREP & GROCERY RULES
Use this document after selecting the user's 15 meals. The goal is to reduce effort, cooking time, food waste, and grocery complexity. Do not create prep tasks simply to make the section longer.

CORE PREP PRINCIPLE
Look across all 15 meals before creating the prep plan. Identify repeated proteins, grains, potatoes, vegetables, fruits, sauces, seasonings, and breakfast ingredients. Then recommend preparing repeated ingredients together. The desired outcome is: prep once, eat faster.

PROTEIN PREP
If the same protein appears in multiple selected meals, recommend cooking multiple portions at once when food safety and recipe quality make that practical. Chicken may appear in Chicken & Roasted Veggies, BBQ Chicken Sandwich, Chicken Avocado Wrap, Sheet Pan Balsamic Chicken, and Chicken & Cheese Quesadilla. Turkey may appear in Egg & Turkey Breakfast Sandwich, Turkey Burger, Swiss Turkey Sandwich, and Turkey Vegetable Hash — deli turkey needs no prep, but ground turkey or patties may be prepared ahead. Ground bison/beef can often be cooked ahead and reheated for Bison Taco Bowl, Taco Salad, and Ground Bison Spaghetti. Do not mix differently seasoned meats together if doing so would compromise the recipes.

GRAIN PREP
When several meals require cooked grains (brown rice, quinoa, couscous), recommend batch-cooking them when practical. Do not tell users to batch-cook quantities that are not needed by the selected plan.

POTATO PREP
Potatoes and sweet potatoes appear frequently (Chicken & Roasted Veggies, Turkey Burger, Cajun Shrimp Sheet Pan, Sheet Pan Balsamic Chicken, Dijon Pork Tenderloin, Turkey Vegetable Hash). If multiple selected meals contain them, estimate the combined amount, recommend roasting or cooking multiple servings together, store portions, and reheat or crisp them when needed.

VEGETABLE PREP
Look for repeated vegetables (bell peppers, Brussels sprouts, spinach, lettuce, tomatoes, asparagus, green beans, onion). If several meals use the same vegetable, suggest washing, chopping, or portioning it in one prep session. Do not recommend chopping produce far in advance if it would significantly reduce quality.

BREAKFAST PREP
Breakfast should remain easy. Overnight oats can be prepared the night before or in batch. Yogurt/cottage cheese bowls can have dry toppings portioned ahead. Oatmeal toppings can be measured in advance. For egg-based meals, pre-chop vegetables rather than pre-cooking the whole meal.

LEFTOVERS
Use leftovers intentionally. If a dinner protein or grain can reasonably support the following day's lunch, mention it (e.g., cook extra chicken tonight so tomorrow's chicken wrap only requires assembly). Do not force leftover strategies when the selected meals do not naturally support them.

PREP OUTPUT
After presenting the five-day plan, create a "Prep Once, Eat Faster" section. Keep it short — prefer approximately 4-8 concrete prep actions, and tell the user which later meals each prep task supports.

GROCERY LIST RULES
Generate the grocery list from the 15 selected recipes only. Do NOT reproduce the full general shopping guide. Organize into: Protein, Produce, Dairy/Refrigerated, Carbs/Grains, Pantry/Sauces, Flavor/Seasonings.

CONSOLIDATE DUPLICATES
Combine ingredients used across multiple meals into one line rather than listing the same ingredient per day. When reliable quantities can be combined, combine them (e.g., 105g + 125g + 120g chicken = approximately 350g cooked chicken), but distinguish cooked weight from raw shopping weight — use practical language like "chicken breast — enough for approximately 350g cooked chicken" rather than inventing a precise raw weight.

PRACTICAL SHOPPING QUANTITIES
Prefer practical purchase units over exact recipe fragments (e.g., "whole grain bread — 1 loaf" instead of listing slices three separate times; "whole grain tortillas — 1 package" instead of individual tortilla counts). Do not exaggerate quantities — when uncertain, preserve recipe quantities rather than inventing package sizes.

PANTRY ITEMS
For small-quantity ingredients (cinnamon, cumin, smoked paprika, hot sauce, mustard, balsamic vinegar, olive oil), list the ingredient without pretending the user needs an exact tiny purchase amount. Treat optional flavor additions as optional — don't require every optional seasoning; favor a small set of seasonings that work across several meals.

MINIMIZE FOOD WASTE
When choosing among equivalent optional ingredients, favor overlap (e.g., use lime consistently across meals rather than lime for one, lemon for another, vinegar for a third) unless recipes specifically require otherwise. Apply this mainly to optional ingredients — do not materially change official recipes just to reduce the grocery list.

SPEED HIERARCHY
When suggesting shortcuts, prefer in this order: batch cooking, leftovers, frozen produce, pre-washed or pre-cut produce, microwaveable grains, canned beans, pre-cooked ingredients that preserve the basic meal, simple assembly meals. Convenience is allowed — the user does not need to cook every ingredient from scratch.

FINAL TEST
Before presenting the prep plan and grocery list, check internally: does every grocery item support at least one selected meal, have duplicates been consolidated, are optional ingredients clearly optional, can any cooking be combined, can tomorrow's meal benefit from today's prep, and is this actually simpler than cooking every meal from scratch. If not, simplify it.`;

const SYSTEM_PROMPT = `${SYSTEM_INSTRUCTIONS}

---

KNOWLEDGE FILE: APPROVED MEAL DATABASE

${MEAL_DATABASE}

---

KNOWLEDGE FILE: PREP & GROCERY RULES

${PREP_GROCERY_RULES}`;

const ACTIVITY_OPTIONS = [
  "Mostly sedentary",
  "Lightly active",
  "Moderately active",
  "Very active",
];

const COOKING_OPTIONS = [
  "Keep it ridiculously easy",
  "I'm fine cooking a little",
  "I enjoy cooking",
];

const SEX_OPTIONS = ["Female", "Male", "Prefer not to say"];

const EMPTY_FORM = {
  units: "imperial",
  sex: "",
  age: "",
  heightFt: "",
  heightIn: "",
  heightCm: "",
  weight: "",
  activity: "",
  cooking: "",
  allergies: "",
  dislikes: "",
};

function buildSummaryFromForm(f) {
  const lines = [];
  if (f.age) lines.push(`Age: ${f.age}`);
  if (f.sex) lines.push(`Sex: ${f.sex}`);
  if (f.units === "imperial") {
    if (f.heightFt || f.heightIn) lines.push(`Height: ${f.heightFt || 0}'${f.heightIn || 0}"`);
    if (f.weight) lines.push(`Weight: ${f.weight} lbs`);
  } else {
    if (f.heightCm) lines.push(`Height: ${f.heightCm} cm`);
    if (f.weight) lines.push(`Weight: ${f.weight} kg`);
  }
  if (f.activity) lines.push(`Activity level: ${f.activity}`);
  if (f.cooking) lines.push(`Cooking preference: ${f.cooking}`);
  if (f.allergies.trim()) lines.push(`Allergies or dietary restrictions: ${f.allergies.trim()}`);
  if (f.dislikes.trim()) lines.push(`Foods I dislike: ${f.dislikes.trim()}`);

  if (lines.length === 0) {
    return "No specific details provided — please build a generally balanced, easy, high-protein plan.";
  }
  return lines.join("\n");
}

const FOLLOW_UP_PROMPTS = [
  "Swap the Day 2 dinner for something else",
  "I don't like one of these meals — suggest an alternative",
  "Show me just the grocery list again",
  "Make this more vegetarian-friendly",
];

// ---------------------------------------------------------------------------
// Tiny markdown renderer — enough for the coach's headings / bold / lists / rules
// ---------------------------------------------------------------------------

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== "");
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function renderContent(content) {
  const lines = content.split("\n");
  const elements = [];
  let listBuffer = [];
  let listType = null;

  const flushList = (key) => {
    if (listBuffer.length === 0) return;
    const items = listBuffer.map((item, i) => (
      <li key={`li-${key}-${i}`}>{renderInline(item, `li-${key}-${i}`)}</li>
    ));
    elements.push(
      listType === "ol" ? (
        <ol className="rich-ol" key={`list-${key}`}>
          {items}
        </ol>
      ) : (
        <ul className="rich-ul" key={`list-${key}`}>
          {items}
        </ul>
      )
    );
    listBuffer = [];
    listType = null;
  };

  lines.forEach((raw, idx) => {
    const line = raw.trim();

    if (line === "") {
      flushList(idx);
      return;
    }
    if (/^_{3,}$/.test(line) || /^-{3,}$/.test(line)) {
      flushList(idx);
      elements.push(<hr className="rich-hr" key={`hr-${idx}`} />);
      return;
    }
    if (line.startsWith("### ")) {
      flushList(idx);
      elements.push(
        <h3 className="rich-h3" key={`h3-${idx}`}>
          {renderInline(line.slice(4), `h3-${idx}`)}
        </h3>
      );
      return;
    }
    if (line.startsWith("## ")) {
      flushList(idx);
      elements.push(
        <h2 className="rich-h2" key={`h2-${idx}`}>
          {renderInline(line.slice(3), `h2-${idx}`)}
        </h2>
      );
      return;
    }
    if (line.startsWith("# ")) {
      flushList(idx);
      elements.push(
        <h1 className="rich-h1" key={`h1-${idx}`}>
          {renderInline(line.slice(2), `h1-${idx}`)}
        </h1>
      );
      return;
    }
    if (line.startsWith("* ") || line.startsWith("- ")) {
      if (listType && listType !== "ul") flushList(idx);
      listType = "ul";
      listBuffer.push(line.slice(2));
      return;
    }
    if (/^\d+\.\s/.test(line)) {
      if (listType && listType !== "ol") flushList(idx);
      listType = "ol";
      listBuffer.push(line.replace(/^\d+\.\s/, ""));
      return;
    }
    flushList(idx);
    elements.push(
      <p className="rich-p" key={`p-${idx}`}>
        {renderInline(line, `p-${idx}`)}
      </p>
    );
  });
  flushList("end");

  return elements;
}

// ---------------------------------------------------------------------------
// Icon
// ---------------------------------------------------------------------------

function LeafForkIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 20c7-1 11-5 12-12 .3-2 .2-3.3 0-4-2 0-5.5 1-8 4C5.5 11 4 15 4 20Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M4 20c1.5-3 3.5-5.5 6-7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MealPlanCoach() {
  const [phase, setPhase] = useState("intake"); // 'intake' | 'chat'
  const [form, setForm] = useState(EMPTY_FORM);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [theme, setTheme] = useState("light");
  const [printId, setPrintId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // The documented example for this capability sends only {model, max_tokens,
  // messages} — no top-level `system` field, no extra fetch options. To rule
  // out an unsupported field breaking the request, the system instructions
  // are folded into the first user turn instead, and we stick to the exact
  // minimal shape from the docs everywhere else.
  async function callClaude(historyForApi) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: historyForApi,
      }),
    });

    if (!response.ok) {
      let detail = "";
      try {
        detail = await response.text();
      } catch (_) {
        /* ignore */
      }
      throw new Error(`Request failed (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`);
    }

    const data = await response.json();
    const chunkText = (data.content || [])
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    return { chunkText, stopReason: data.stop_reason };
  }

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), ms)),
    ]);
  }

  function toApiHistory(historyMessages) {
    // Fold the system instructions into the first turn's content so every
    // request matches the plain {model, max_tokens, messages} shape.
    return historyMessages.map((m, idx) =>
      idx === 0 ? { role: m.role, content: `${SYSTEM_PROMPT}\n\n---\n\n${m.content}` } : { role: m.role, content: m.content }
    );
  }

  async function handleTestConnection() {
    setError(null);
    setDebugInfo("Testing connection…");
    try {
      const { chunkText } = await withTimeout(
        callClaude([{ role: "user", content: "Reply with only the single word: OK" }]),
        20000
      );
      setDebugInfo(`Connection OK. Model replied: "${chunkText.trim()}"`);
    } catch (err) {
      console.error("Test connection failed:", err);
      setDebugInfo(`Connection test failed: ${err.message === "TIMEOUT" ? "timed out after 20s" : err.message}`);
    }
  }

  async function handleSend(overrideText) {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setDebugInfo(null);
    setLoading(true);

    // A full 5-day plan runs well past a single 1000-token response, so the
    // coach continues automatically behind the scenes and stitches the
    // pieces into one message — the person only ever sees the final result.
    const MAX_CONTINUATIONS = 8;
    const TIMEOUT_MS = 40000;

    try {
      let history = toApiHistory(nextMessages.map((m) => ({ role: m.role, content: m.content })));
      let fullText = "";
      let stopReason = null;
      let round = 0;

      while (round < MAX_CONTINUATIONS) {
        const { chunkText, stopReason: sr } = await withTimeout(callClaude(history), TIMEOUT_MS);
        fullText += chunkText;
        stopReason = sr;
        round += 1;

        if (stopReason !== "max_tokens") break;

        history = [
          ...history,
          { role: "assistant", content: chunkText },
          {
            role: "user",
            content:
              "Continue exactly where you left off. Do not repeat any earlier text and do not restart the plan.",
          },
        ];
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullText.trim() || "I didn't catch that — could you try again?" },
      ]);
    } catch (err) {
      console.error("Meal plan coach request failed:", err);
      if (err.message === "TIMEOUT") {
        setError("That took too long to respond. Please try again.");
      } else {
        setError(`Something went wrong generating a response. (${err.message})`);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setPhase("intake");
    setForm(EMPTY_FORM);
    setMessages([]);
    setInput("");
    setError(null);
  }

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFormSubmit() {
    const summary = buildSummaryFromForm(form);
    setPhase("chat");
    handleSend(summary);
  }

  function handleCopy(idx, content) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        setCopiedId(idx);
        setTimeout(() => setCopiedId(null), 1500);
      });
    }
  }

  function handlePrint(idx) {
    setPrintId(idx);
    setTimeout(() => {
      window.print();
      setPrintId(null);
    }, 80);
  }

  const showFollowUps = phase === "chat" && messages.length >= 2 && !loading;

  return (
    <div className="mpc-root" data-theme={theme}>
      <style>{`
        .mpc-root {
          --font-display: 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif;
          --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          height: 100%;
          min-height: 640px;
          display: flex;
          flex-direction: column;
          font-family: var(--font-body);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--line);
        }
        .mpc-root[data-theme="light"] {
          --bg: #F2F4EA;
          --surface: #FFFFFF;
          --surface-alt: #E8EDDC;
          --ink: #1E2A1C;
          --ink-soft: #5B6B54;
          --line: #DAE0C8;
          --accent: #4B6B45;
          --accent-strong: #34502E;
          --accent-ink: #FFFFFF;
          --gold: #B97D22;
          --error: #A6402E;
        }
        .mpc-root[data-theme="dark"] {
          --bg: #131A11;
          --surface: #1C2619;
          --surface-alt: #23301E;
          --ink: #EBEFE2;
          --ink-soft: #A9B59D;
          --line: #33452D;
          --accent: #86AE7A;
          --accent-strong: #A7CB9C;
          --accent-ink: #10160D;
          --gold: #E0A94A;
          --error: #E08268;
        }
        .mpc-root * { box-sizing: border-box; }
        .mpc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 18px;
          background: var(--surface);
          border-bottom: 1px solid var(--line);
        }
        .mpc-brand { display: flex; align-items: center; gap: 10px; color: var(--ink); }
        .mpc-brand-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: var(--accent); color: var(--accent-ink);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .mpc-brand-text h1 {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 600;
          margin: 0;
          letter-spacing: 0.01em;
          color: var(--ink);
        }
        .mpc-brand-text p {
          margin: 1px 0 0;
          font-size: 0.72rem;
          color: var(--ink-soft);
        }
        .mpc-header-actions { display: flex; align-items: center; gap: 6px; }
        .mpc-debug {
          background: #FFF4C2;
          color: #4A3B00;
          font-size: 0.78rem;
          padding: 8px 16px;
          border-bottom: 1px solid #E0C64A;
          word-break: break-word;
        }
        .mpc-icon-btn {
          border: 1px solid var(--line);
          background: var(--surface);
          color: var(--ink-soft);
          border-radius: 8px;
          height: 30px;
          padding: 0 10px;
          font-size: 0.72rem;
          font-family: var(--font-body);
          cursor: pointer;
        }
        .mpc-icon-btn:hover { color: var(--ink); border-color: var(--accent); }

        .mpc-scroll {
          flex: 1;
          overflow-y: auto;
          background: var(--bg);
          padding: 20px 16px 8px;
        }
        .mpc-thread { max-width: 640px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }

        .mpc-message { display: flex; }
        .mpc-message.user { justify-content: flex-end; }
        .mpc-bubble-user {
          background: var(--accent);
          color: var(--accent-ink);
          padding: 10px 14px;
          border-radius: 14px 14px 3px 14px;
          max-width: 80%;
          font-size: 0.92rem;
          line-height: 1.45;
        }
        .mpc-card {
          background: var(--surface);
          border: 1px solid var(--line);
          border-left: 3px solid var(--accent);
          border-radius: 4px 12px 12px 4px;
          padding: 14px 18px 10px;
          max-width: 100%;
          width: 100%;
        }
        .mpc-card-actions {
          display: flex;
          gap: 8px;
          margin-top: 6px;
          padding-top: 8px;
          border-top: 1px dashed var(--line);
        }
        .mpc-mini-btn {
          border: none;
          background: none;
          color: var(--ink-soft);
          font-size: 0.72rem;
          font-family: var(--font-body);
          cursor: pointer;
          padding: 2px 4px;
        }
        .mpc-mini-btn:hover { color: var(--accent-strong); }

        .rich-h1 { font-family: var(--font-display); font-size: 1.3rem; margin: 6px 0 10px; color: var(--ink); }
        .rich-h2 { font-family: var(--font-display); font-size: 1.08rem; margin: 16px 0 6px; color: var(--accent-strong); }
        .rich-h3 { font-size: 0.92rem; font-weight: 700; margin: 12px 0 2px; color: var(--ink); }
        .rich-p { font-size: 0.9rem; line-height: 1.55; margin: 4px 0; color: var(--ink); }
        .rich-ul, .rich-ol { margin: 4px 0 8px; padding-left: 20px; }
        .rich-ul li, .rich-ol li { font-size: 0.9rem; line-height: 1.5; color: var(--ink); margin-bottom: 2px; }
        .rich-hr { border: none; border-top: 1px solid var(--line); margin: 14px 0; }

        .mpc-typing { display: flex; gap: 4px; padding: 6px 2px; }
        .mpc-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ink-soft); opacity: 0.5; animation: mpc-blink 1.1s infinite; }
        .mpc-dot:nth-child(2) { animation-delay: 0.15s; }
        .mpc-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes mpc-blink { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 0.9; } }

        .mpc-error {
          max-width: 640px; margin: 0 auto 10px;
          background: color-mix(in srgb, var(--error) 12%, var(--surface));
          border: 1px solid var(--error);
          color: var(--error);
          font-size: 0.82rem;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .mpc-intake { max-width: 640px; margin: 4px auto 28px; }
        .mpc-intake-lede { font-size: 0.85rem; color: var(--ink-soft); margin: 0 0 18px; }
        .mpc-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 560px) { .mpc-form-grid { grid-template-columns: 1fr; } }
        .mpc-form-col {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 16px 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mpc-form-heading {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 2px;
          color: var(--ink);
        }
        .mpc-field { display: flex; flex-direction: column; gap: 5px; font-size: 0.78rem; color: var(--ink-soft); }
        .mpc-field-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .mpc-field select,
        .mpc-field input {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: var(--ink);
          background: var(--bg);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 8px 10px;
        }
        .mpc-field select:focus,
        .mpc-field input:focus { outline: none; border-color: var(--accent); }
        .mpc-form-actions { display: flex; justify-content: center; margin-top: 20px; }
        .mpc-build-btn { padding: 0 22px; height: 44px; font-size: 0.92rem; border-radius: 12px; }
        .mpc-intake .mpc-disclaimer { margin-top: 12px; }

        .mpc-starters { max-width: 640px; margin: 4px auto 0; display: flex; flex-wrap: wrap; gap: 6px; }
        .mpc-chip {
          border: 1px solid var(--line);
          background: var(--surface);
          color: var(--ink-soft);
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 0.76rem;
          font-family: var(--font-body);
          cursor: pointer;
          text-align: left;
        }
        .mpc-chip:hover { border-color: var(--accent); color: var(--accent-strong); }

        .mpc-footer { background: var(--surface); border-top: 1px solid var(--line); padding: 12px 16px 14px; }
        .mpc-input-row { max-width: 640px; margin: 0 auto; display: flex; gap: 8px; align-items: flex-end; }
        .mpc-textarea {
          flex: 1;
          resize: none;
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 10px 12px;
          font-family: var(--font-body);
          font-size: 0.9rem;
          background: var(--bg);
          color: var(--ink);
          max-height: 120px;
          min-height: 40px;
        }
        .mpc-textarea:focus { outline: none; border-color: var(--accent); }
        .mpc-send-btn {
          background: var(--accent);
          color: var(--accent-ink);
          border: none;
          border-radius: 10px;
          height: 40px;
          padding: 0 16px;
          font-size: 0.86rem;
          font-family: var(--font-body);
          font-weight: 600;
          cursor: pointer;
          flex-shrink: 0;
        }
        .mpc-send-btn:disabled { opacity: 0.5; cursor: default; }
        .mpc-disclaimer { max-width: 640px; margin: 8px auto 0; font-size: 0.68rem; color: var(--ink-soft); text-align: center; }

        @media print {
          body * { visibility: hidden; }
          .mpc-print-target, .mpc-print-target * { visibility: visible; }
          .mpc-print-target { position: absolute; top: 0; left: 0; width: 100%; padding: 24px; border: none !important; }
          .mpc-print-target .mpc-card-actions { display: none !important; }
        }
      `}</style>

      <div className="mpc-header">
        <div className="mpc-brand">
          <div className="mpc-brand-icon">
            <LeafForkIcon size={18} />
          </div>
          <div className="mpc-brand-text">
            <h1>5-Day Meal Plan Coach</h1>
            <p>Simple, high-protein, easy to actually follow</p>
          </div>
        </div>
        <div className="mpc-header-actions">
          <button className="mpc-icon-btn" onClick={handleTestConnection}>
            Test connection
          </button>
          <button className="mpc-icon-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {theme === "light" ? "Dark" : "Light"}
          </button>
          <button className="mpc-icon-btn" onClick={handleReset}>
            New plan
          </button>
        </div>
      </div>

      {debugInfo && <div className="mpc-debug">{debugInfo}</div>}

      {phase === "intake" ? (
        <div className="mpc-scroll">
          <div className="mpc-intake">
            <p className="mpc-intake-lede">
              Fill in what you know — everything is optional, so skip anything you'd rather not share.
            </p>

            <div className="mpc-form-grid">
              <div className="mpc-form-col">
                <h2 className="mpc-form-heading">Basic details</h2>

                <label className="mpc-field">
                  <span>Units</span>
                  <select value={form.units} onChange={(e) => updateForm("units", e.target.value)}>
                    <option value="imperial">Imperial (lbs / ft-in)</option>
                    <option value="metric">Metric (kg / cm)</option>
                  </select>
                </label>

                <label className="mpc-field">
                  <span>Sex</span>
                  <select value={form.sex} onChange={(e) => updateForm("sex", e.target.value)}>
                    <option value="">Prefer not to answer</option>
                    {SEX_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mpc-field">
                  <span>Age</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 34"
                    value={form.age}
                    onChange={(e) => updateForm("age", e.target.value)}
                  />
                </label>

                {form.units === "imperial" ? (
                  <div className="mpc-field-pair">
                    <label className="mpc-field">
                      <span>Height (ft)</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="5"
                        value={form.heightFt}
                        onChange={(e) => updateForm("heightFt", e.target.value)}
                      />
                    </label>
                    <label className="mpc-field">
                      <span>Height (in)</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="9"
                        value={form.heightIn}
                        onChange={(e) => updateForm("heightIn", e.target.value)}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="mpc-field">
                    <span>Height (cm)</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="175"
                      value={form.heightCm}
                      onChange={(e) => updateForm("heightCm", e.target.value)}
                    />
                  </label>
                )}

                <label className="mpc-field">
                  <span>Weight ({form.units === "imperial" ? "lbs" : "kg"})</span>
                  <input
                    type="number"
                    min="0"
                    placeholder={form.units === "imperial" ? "180" : "82"}
                    value={form.weight}
                    onChange={(e) => updateForm("weight", e.target.value)}
                  />
                </label>
              </div>

              <div className="mpc-form-col">
                <h2 className="mpc-form-heading">Activity & preferences</h2>

                <label className="mpc-field">
                  <span>Activity level</span>
                  <select value={form.activity} onChange={(e) => updateForm("activity", e.target.value)}>
                    <option value="">Select one</option>
                    {ACTIVITY_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mpc-field">
                  <span>Cooking preference</span>
                  <select value={form.cooking} onChange={(e) => updateForm("cooking", e.target.value)}>
                    <option value="">Select one</option>
                    {COOKING_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mpc-field">
                  <span>Allergies or dietary restrictions</span>
                  <input
                    type="text"
                    placeholder="e.g. dairy-free, shellfish allergy — leave blank if none"
                    value={form.allergies}
                    onChange={(e) => updateForm("allergies", e.target.value)}
                  />
                </label>

                <label className="mpc-field">
                  <span>Foods you strongly dislike</span>
                  <input
                    type="text"
                    placeholder="e.g. mushrooms, seafood — leave blank if none"
                    value={form.dislikes}
                    onChange={(e) => updateForm("dislikes", e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="mpc-form-actions">
              <button type="button" className="mpc-send-btn mpc-build-btn" disabled={loading} onClick={handleFormSubmit}>
                {loading ? "Building your plan…" : "Build my 5-day plan"}
              </button>
            </div>
            <div className="mpc-disclaimer">
              General nutrition guidance only — not a substitute for medical or dietary advice.
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mpc-scroll" ref={scrollRef}>
            <div className="mpc-thread">
              {messages.map((m, idx) => (
                <div className={`mpc-message ${m.role}`} key={idx}>
                  {m.role === "user" ? (
                    <div className="mpc-bubble-user">{m.content}</div>
                  ) : (
                    <div className={`mpc-card ${printId === idx ? "mpc-print-target" : ""}`}>
                      {renderContent(m.content)}
                      <div className="mpc-card-actions">
                        <button className="mpc-mini-btn" onClick={() => handleCopy(idx, m.content)}>
                          {copiedId === idx ? "Copied" : "Copy"}
                        </button>
                        <button className="mpc-mini-btn" onClick={() => handlePrint(idx)}>
                          Print / Save PDF
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="mpc-message assistant">
                  <div className="mpc-card">
                    <div className="mpc-typing">
                      <div className="mpc-dot" />
                      <div className="mpc-dot" />
                      <div className="mpc-dot" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && <div className="mpc-error">{error}</div>}

            {showFollowUps && (
              <div className="mpc-starters">
                {FOLLOW_UP_PROMPTS.map((p, i) => (
                  <button className="mpc-chip" key={i} onClick={() => setInput(p)}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mpc-footer">
            <div className="mpc-input-row">
              <textarea
                className="mpc-textarea"
                rows={1}
                placeholder="Ask for a tweak — swap a meal, adjust a preference, anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button className="mpc-send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
                Send
              </button>
            </div>
            <div className="mpc-disclaimer">
              General nutrition guidance only — not a substitute for medical or dietary advice.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
