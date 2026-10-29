import { beforeEach, describe, expect, it } from 'vitest'
import { FAVOURITES_KEY, loadFavourites, onlyFavourites, saveFavourites, toggleFavourite } from './favourites'
import { recipes } from './recipes'

beforeEach(() => localStorage.clear())

describe('toggleFavourite', () => {
  it('adds a missing id and removes a present one without mutating the input', () => {
    const empty = new Set<string>()
    const starred = toggleFavourite(empty, 'tacos')
    expect([...starred]).toEqual(['tacos'])
    expect(empty.size).toBe(0)
    expect([...toggleFavourite(starred, 'tacos')]).toEqual([])
  })
})

describe('loadFavourites and saveFavourites', () => {
  it('round-trips through storage', () => {
    saveFavourites(localStorage, new Set(['curry', 'ramen']))
    expect([...loadFavourites(localStorage)]).toEqual(['curry', 'ramen'])
  })

  it('reads nothing stored as no favourites', () => {
    expect(loadFavourites(localStorage).size).toBe(0)
  })

  it('ignores malformed storage', () => {
    localStorage.setItem(FAVOURITES_KEY, '{not json')
    expect(loadFavourites(localStorage).size).toBe(0)
    localStorage.setItem(FAVOURITES_KEY, '{"a":1}')
    expect(loadFavourites(localStorage).size).toBe(0)
    localStorage.setItem(FAVOURITES_KEY, '["curry", 3, null]')
    expect([...loadFavourites(localStorage)]).toEqual(['curry'])
  })
})

describe('onlyFavourites', () => {
  it('keeps starred recipes in list order', () => {
    expect(onlyFavourites(recipes, new Set(['ramen', 'carbonara'])).map((r) => r.id)).toEqual(['carbonara', 'ramen'])
  })
})
