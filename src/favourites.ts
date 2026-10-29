import type { Recipe } from './recipes'

export const FAVOURITES_KEY = 'recipe-book:favourites'

/** Starred recipe ids from storage; anything missing or malformed reads as none. */
export function loadFavourites(storage: Storage): Set<string> {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(FAVOURITES_KEY) ?? '[]')
    return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [])
  } catch {
    return new Set()
  }
}

export function saveFavourites(storage: Storage, favourites: ReadonlySet<string>): void {
  storage.setItem(FAVOURITES_KEY, JSON.stringify([...favourites]))
}

/** A copy of the set with the id added if absent, removed if present. */
export function toggleFavourite(favourites: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(favourites)
  if (!next.delete(id)) next.add(id)
  return next
}

export function onlyFavourites(list: readonly Recipe[], favourites: ReadonlySet<string>): Recipe[] {
  return list.filter((r) => favourites.has(r.id))
}
