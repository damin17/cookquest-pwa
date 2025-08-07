import type { Recipe } from './xp';

export type BadgeRule = {
  code: string;
  name: string;
  description: string;
  target: number;
  matches: (r: Recipe) => boolean;
  category: 'ingredient' | 'cuisine' | 'method';
};

export type BadgeProgress = {
  code: string;
  name: string;
  description: string;
  target: number;
  count: number;
  achieved: boolean;
};

export const RULES: BadgeRule[] = [
  { code: 'ING_GARLIC_T1', name: 'Garlic Apprentice', description: 'Cook 10 meals with garlic.', target: 10, category: 'ingredient', matches: r => r.ingredients.includes('garlic') },
  { code: 'ING_GARLIC_T2', name: 'Garlic Master', description: 'Cook 50 meals with garlic.', target: 50, category: 'ingredient', matches: r => r.ingredients.includes('garlic') },
  { code: 'CUISINE_FRENCH_T1', name: 'Petit Chef', description: 'Cook 10 French dishes.', target: 10, category: 'cuisine', matches: r => r.cuisine.toLowerCase() === 'french' },
  { code: 'CUISINE_FRENCH_T2', name: 'Grand Chef', description: 'Cook 25 French dishes.', target: 25, category: 'cuisine', matches: r => r.cuisine.toLowerCase() === 'french' },
  { code: 'METHOD_BAKE_T1', name: 'Baker Beginner', description: 'Bake 10 recipes.', target: 10, category: 'method', matches: r => r.method.toLowerCase() === 'bake' || r.method.toLowerCase() === 'baking' },
];

export function computeBadgeProgress(recipes: Recipe[]): BadgeProgress[] {
  return RULES.map(rule => {
    const count = recipes.filter(rule.matches).length;
    return {
      code: rule.code,
      name: rule.name,
      description: rule.description,
      target: rule.target,
      count,
      achieved: count >= rule.target
    }
  });
}
