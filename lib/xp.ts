export type Recipe = {
  id: string;
  title: string;
  cuisine: string;
  method: string;
  ingredients: string[];
  difficulty: 'easy'|'medium'|'hard';
  createdAt: number;
};

export function recipeXP(r: Recipe): number {
  let xp = 10;
  if (r.difficulty === 'medium') xp += 5;
  if (r.difficulty === 'hard') xp += 10;
  xp += Math.min(r.ingredients.length, 5) * 2;
  return xp;
}

export function totalXP(recipes: Recipe[]): number {
  return recipes.reduce((sum, r) => sum + recipeXP(r), 0);
}

export function levelFromXP(xp: number): number {
  return Math.max(1, Math.floor(1 + Math.sqrt(xp / 100)));
}
