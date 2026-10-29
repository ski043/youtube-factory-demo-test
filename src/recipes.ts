export type Recipe = {
  id: string
  name: string
  minutes: number
  servings: number
  tags: string[]
}

export const recipes: Recipe[] = [
  { id: 'carbonara', name: 'Spaghetti carbonara', minutes: 25, servings: 2, tags: ['pasta', 'quick'] },
  { id: 'shakshuka', name: 'Shakshuka', minutes: 30, servings: 2, tags: ['eggs', 'vegetarian'] },
  { id: 'curry', name: 'Chickpea curry', minutes: 40, servings: 4, tags: ['vegan', 'spicy'] },
  { id: 'risotto', name: 'Mushroom risotto', minutes: 45, servings: 3, tags: ['rice', 'vegetarian'] },
  { id: 'tacos', name: 'Fish tacos', minutes: 20, servings: 2, tags: ['fish', 'quick'] },
  { id: 'ramen', name: 'Miso ramen', minutes: 35, servings: 2, tags: ['noodles', 'soup'] },
]

/** Recipes whose name or tags contain the query, ignoring case and surrounding spaces. */
export function filterRecipes(list: readonly Recipe[], query: string): Recipe[] {
  const q = query.trim().toLowerCase()
  if (!q) return [...list]
  return list.filter((r) => r.name.toLowerCase().includes(q) || r.tags.some((t) => t.includes(q)))
}

/** "25 min", or "1 h 5 min" from an hour on. */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

/** "3 recipes · 1 h 35 min", or "No recipes" for an empty list. */
export function summarizeRecipes(list: readonly Recipe[]): string {
  if (list.length === 0) return 'No recipes'
  const total = list.reduce((sum, r) => sum + r.minutes, 0)
  return `${list.length} ${list.length === 1 ? 'recipe' : 'recipes'} · ${formatMinutes(total)}`
}
