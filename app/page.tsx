'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { saveRecipe, listRecipes, deleteRecipe } from '@/lib/db';
import type { Recipe } from '@/lib/xp';
import { totalXP, levelFromXP, recipeXP } from '@/lib/xp';
import { computeBadgeProgress } from '@/lib/badges';

type FormState = {
  title: string;
  cuisine: string;
  method: string;
  ingredients: string;
  difficulty: 'easy'|'medium'|'hard';
};

const initial: FormState = { title: '', cuisine: '', method: '', ingredients: '', difficulty: 'easy' };

export default function Page() {
  const [form, setForm] = useState<FormState>(initial);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [justLeveled, setJustLeveled] = useState<number|null>(null);

  useEffect(() => {
    (async () => {
      const data = await listRecipes();
      data.sort((a,b) => b.createdAt - a.createdAt);
      setRecipes(data);
    })();
  }, []);

  const xp = useMemo(() => totalXP(recipes), [recipes]);
  const level = useMemo(() => levelFromXP(xp), [xp]);
  const badges = useMemo(() => computeBadgeProgress(recipes), [recipes]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ing = form.ingredients.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const recipe: Recipe = {
      id: crypto.randomUUID(),
      title: form.title.trim() || 'Untitled',
      cuisine: form.cuisine.trim(),
      method: form.method.trim(),
      ingredients: ing,
      difficulty: form.difficulty,
      createdAt: Date.now(),
    };
    const prevLevel = level;
    await saveRecipe(recipe);
    const data = await listRecipes();
    data.sort((a,b) => b.createdAt - a.createdAt);
    setRecipes(data);
    setForm(initial);
    const newXP = totalXP(data);
    const newLevel = levelFromXP(newXP);
    if (newLevel > prevLevel) {
      setJustLeveled(newLevel);
      setTimeout(() => setJustLeveled(null), 4000);
    }
  }

  async function onDelete(id: string) {
    await deleteRecipe(id);
    const data = await listRecipes();
    data.sort((a,b) => b.createdAt - a.createdAt);
    setRecipes(data);
  }

  return (
    <div className="container">
      {justLeveled && (
        <div className="card" role="alert" aria-live="assertive">
          <strong>Level up!</strong> You reached level {justLeveled} 🎉
        </div>
      )}

      <section className="card">
        <h2 className="text-xl font-semibold">Log a Recipe</h2>
        <form className="grid-2" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm">Title</label>
            <input className="w-full p-2 border rounded" value={form.title} onChange={e => setForm(s => ({...s, title: e.target.value}))} placeholder="Garlic butter pasta" />
          </div>
          <div>
            <label className="block text-sm">Cuisine</label>
            <input className="w-full p-2 border rounded" value={form.cuisine} onChange={e => setForm(s => ({...s, cuisine: e.target.value}))} placeholder="French, Italian, ..." />
          </div>
          <div>
            <label className="block text-sm">Method</label>
            <input className="w-full p-2 border rounded" value={form.method} onChange={e => setForm(s => ({...s, method: e.target.value}))} placeholder="Bake, Grill, Stir-fry..." />
          </div>
          <div>
            <label className="block text-sm">Ingredients (comma-separated)</label>
            <input className="w-full p-2 border rounded" value={form.ingredients} onChange={e => setForm(s => ({...s, ingredients: e.target.value}))} placeholder="garlic, olive oil, basil" />
          </div>
          <div>
            <label className="block text-sm">Difficulty</label>
            <select className="w-full p-2 border rounded" value={form.difficulty} onChange={e => setForm(s => ({...s, difficulty: e.target.value as any}))}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="self-end">
            <button className="px-4 py-2 rounded bg-black text-white">Add Recipe</button>
          </div>
        </form>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold">Your Progress</h2>
        <div className="grid-2">
          <div>
            <p><strong>Total XP:</strong> {xp}</p>
            <p><strong>Level:</strong> {level}</p>
            <div className="progress" aria-label="XP progress to next level">
              <span style={{ width: `${Math.min(100, (xp % 100))}%` }} />
            </div>
            <p className="text-xs text-slate-500">Level formula is experimental and for demo purposes.</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Badges</h3>
            <div>
              {badges.map(b => (
                <div key={b.code} className="mb-2">
                  <span className="badge">{b.achieved ? '✓' : '•'} {b.name}</span>
                  <div className="progress" title={`${b.count}/${b.target}`}> 
                    <span style={{ width: `${Math.min(100, (b.count / b.target) * 100)}%` }} />
                  </div>
                  <p className="text-xs text-slate-500">{b.description} — {b.count}/{b.target}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold">Recent Recipes</h2>
        {recipes.length === 0 && <p className="text-slate-600">No recipes yet. Log your first one above!</p>}
        <ul>
          {recipes.map(r => (
            <li key={r.id} className="flex items-center justify-between border-b py-2">
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()} • {r.cuisine || '—'} • {r.method || '—'} • +{recipeXP(r)} XP</div>
                <div className="text-xs">
                  {r.ingredients.map(i => <span key={i} className="badge">{i}</span>)}
                </div>
              </div>
              <button className="text-red-600 text-sm" onClick={() => onDelete(r.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
