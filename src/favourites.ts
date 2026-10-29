import type { Recipe } from './recipes'

export const FAVOURITES_KEY = 'recipe-book:favourites'

/** A copy of the set with the id added, or removed if it was already there. */
export function toggleFavourite(favourites: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(favourites)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

/** Saved favourite ids, keeping only string entries; empty when missing or unreadable. */
export function loadFavourites(storage: Pick<Storage, 'getItem'>): Set<string> {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(FAVOURITES_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((id): id is string => typeof id === 'string'))
  } catch {
    return new Set()
  }
}

/** Writes the ids as a JSON array, ignoring storage errors such as a full quota. */
export function saveFavourites(storage: Pick<Storage, 'setItem'>, favourites: ReadonlySet<string>): void {
  try {
    storage.setItem(FAVOURITES_KEY, JSON.stringify([...favourites]))
  } catch {
    // Favourites still work for this session.
  }
}

/** Recipes whose id is in the favourites, in their original order. */
export function onlyFavourites(list: readonly Recipe[], favourites: ReadonlySet<string>): Recipe[] {
  return list.filter((r) => favourites.has(r.id))
}
