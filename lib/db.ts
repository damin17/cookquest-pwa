import { openDB, IDBPDatabase } from 'idb';
import type { Recipe } from './xp';

const DB_NAME = 'cookquest';
const STORE = 'recipes';

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    });
  }
  return dbPromise;
}

export async function saveRecipe(r: Recipe) {
  const db = await getDB();
  await db.put(STORE, r);
}

export async  listRecipes(): Promise<Recipe[]> {
  const db = await getDB();
  return (await db.getAll(STORE)) as Recipe[];
}

export async function deleteRecipe(id: string) {
  const db = await getDB();
  await db.delete(STORE, id);
}
