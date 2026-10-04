import { Recipe } from '../types/recipe';
import { MacroNutrients } from '../types/nutrition';

export const RECIPES_CATALOG: Recipe[] = [
  {
    id: 'recipe-honey-glazed-salmon',
    title: 'Honey-Glazed Atlantic Salmon & Jasmine Rice',
    description: 'Crispy skin wild salmon with quick honey-soy glaze over jasmine rice and steamed broccoli.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 1,
    calories: 580,
    proteinG: 44,
    carbsG: 56,
    fatG: 18,
    fiberG: 4.5,
    tags: ['High Protein', 'Omega-3', 'Fast Post-Workout'],
    dietaryCategory: 'recovery',
    ingredients: [
      { name: 'Wild Atlantic Salmon Fillet', amount: '200g' },
      { name: 'Jasmine Rice (cooked)', amount: '180g' },
      { name: 'Steamed Broccoli florets', amount: '100g' },
      { name: 'Raw Honey & Low-Sodium Tamari', amount: '1 tbsp each' },
    ],
    instructions: [
      'Pat salmon dry with paper towel, season with coarse salt and pepper.',
      'Sear skin-down in smoking hot stainless pan for 4 minutes until crisp.',
      'Flip, reduce heat, brush with honey-tamari reduction and cook 2 minutes.',
      'Serve over steamed jasmine rice with freshly steamed broccoli.',
    ],
  },
  {
    id: 'recipe-bison-sweet-potato-skillet',
    title: 'Lean Bison & Spiced Sweet Potato Skillet',
    description: '90/10 ground bison browned with smoked paprika, diced sweet potato cubes, and spinach.',
    prepTimeMinutes: 12,
    cookTimeMinutes: 18,
    servings: 1,
    calories: 520,
    proteinG: 48,
    carbsG: 46,
    fatG: 14,
    fiberG: 7.2,
    tags: ['Iron-Rich', 'Clean Carb Fuel', 'Low Glycemic'],
    dietaryCategory: 'high_protein',
    ingredients: [
      { name: '90% Lean Ground Bison', amount: '180g' },
      { name: 'Diced Sweet Potato', amount: '200g' },
      { name: 'Baby Spinach', amount: '80g' },
      { name: 'Avocado Oil', amount: '1 tsp' },
      { name: 'Smoked Paprika & Garlic Powder', amount: '1 tsp' },
    ],
    instructions: [
      'Saute diced sweet potatoes in avocado oil on medium-high until golden and tender (8 mins).',
      'Add ground bison, breaking apart until browned thoroughly.',
      'Fold in baby spinach and smoked paprika until wilted, remove from heat immediately.',
    ],
  },
  {
    id: 'recipe-greek-parfait',
    title: 'Anabolic Greek Yogurt & Berry Crunch Bowl',
    description: 'Thick non-fat strained Greek yogurt layered with whey protein, chia seeds, and berries.',
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    servings: 1,
    calories: 360,
    proteinG: 42,
    carbsG: 34,
    fatG: 4.5,
    fiberG: 8.5,
    tags: ['No-Cook', 'Slow-Digesting Casein', 'Gut Microbiome'],
    dietaryCategory: 'high_protein',
    ingredients: [
      { name: '0% Plain Greek Yogurt', amount: '250g' },
      { name: 'Vanilla Whey Isolate', amount: '20g' },
      { name: 'Fresh Blueberries & Raspberries', amount: '100g' },
      { name: 'Chia Seeds', amount: '10g' },
    ],
    instructions: [
      'Whisk Greek yogurt and vanilla whey isolate until velvety and smooth.',
      'Top with fresh washed berries and sprinkle organic chia seeds.',
      'Enjoy immediately or chill for 30 minutes for pudding texture.',
    ],
  },
  {
    id: 'recipe-turkey-quinoa-bowl',
    title: 'Zesty Lime Turkey & Fluffy Quinoa Bowl',
    description: 'Herb-seasoned lean ground turkey breast with tri-color quinoa, black beans, and fresh cilantro.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 14,
    servings: 1,
    calories: 490,
    proteinG: 46,
    carbsG: 52,
    fatG: 11,
    fiberG: 9,
    tags: ['Lean Mass', 'Complete Protein', 'Meal Prep Ready'],
    dietaryCategory: 'balanced',
    ingredients: [
      { name: '99% Lean Ground Turkey', amount: '175g' },
      { name: 'Cooked Tri-Color Quinoa', amount: '150g' },
      { name: 'Black Beans (Rinsed)', amount: '60g' },
      { name: 'Fresh Lime Juice & Cumin', amount: '1 tbsp' },
    ],
    instructions: [
      'Brown turkey in a skillet with cumin, sea salt, and black pepper.',
      'Toss warm cooked quinoa with rinsed black beans and fresh lime juice.',
      'Combine turkey over quinoa base and garnish with chopped fresh cilantro.',
    ],
  },
];

export function computeRecipeMacroMatch(
  recipe: Recipe,
  remainingBudget: MacroNutrients
): number {
  if (!recipe) return 0;

  // If user has already reached or exceeded daily calories, heavily deprioritize high-calorie meals
  if (remainingBudget.calories <= 0) {
    return Math.max(5, Math.round(30 - Math.min(25, recipe.calories / 30)));
  }

  let score = 100;

  // Calorie alignment
  const calDiff = Math.abs(recipe.calories - remainingBudget.calories);
  const calPenalty = Math.min(50, (calDiff / remainingBudget.calories) * 45);
  score -= calPenalty;

  // Protein fulfillment bonus
  if (remainingBudget.proteinG > 0) {
    const proteinRatio = recipe.proteinG / remainingBudget.proteinG;
    if (proteinRatio >= 0.4 && proteinRatio <= 1.2) {
      score += 12;
    }
  }

  // Cap score between 10 and 99
  return Math.round(Math.max(10, Math.min(99, score)));
}
