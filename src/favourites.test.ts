import { describe, expect, it } from 'vitest'
import { FAVOURITES_KEY, loadFavourites, onlyFavourites, saveFavourites, toggleFavourite } from './favourites'
import { recipes } from './recipes'

function memoryStorage(initial?: string): Pick<Storage, 'getItem' | 'setItem'> {
  const data = new Map<string, string>()
  if (initial !== undefined) data.set(FAVOURITES_KEY, initial)
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
  }
}

describe('toggleFavourite', () => {
  it('adds a missing id and removes a present one', () => {
    const added = toggleFavourite(new Set(['curry']), 'tacos')
    expect([...added]).toEqual(['curry', 'tacos'])
    expect([...toggleFavourite(added, 'curry')]).toEqual(['tacos'])
  })

  it('leaves the input set untouched', () => {
    const before = new Set(['curry'])
    toggleFavourite(before, 'curry')
    toggleFavourite(before, 'tacos')
    expect([...before]).toEqual(['curry'])
  })
})

describe('loadFavourites', () => {
  it('is empty when nothing is saved', () => {
    expect(loadFavourites(memoryStorage()).size).toBe(0)
  })

  it('is empty for malformed JSON or a non-array', () => {
    expect(loadFavourites(memoryStorage('[not json')).size).toBe(0)
    expect(loadFavourites(memoryStorage('{"curry":true}')).size).toBe(0)
    expect(loadFavourites(memoryStorage('"curry"')).size).toBe(0)
    expect(loadFavourites(memoryStorage('null')).size).toBe(0)
  })

  it('keeps only string entries', () => {
    expect([...loadFavourites(memoryStorage('["curry", 3, null, "tacos"]'))]).toEqual(['curry', 'tacos'])
  })

  it('reads back what saveFavourites wrote', () => {
    const storage = memoryStorage()
    saveFavourites(storage, new Set(['ramen', 'shakshuka']))
    expect(storage.getItem(FAVOURITES_KEY)).toBe('["ramen","shakshuka"]')
    expect([...loadFavourites(storage)]).toEqual(['ramen', 'shakshuka'])
  })
})

describe('saveFavourites', () => {
  it('does not throw when storage refuses the write', () => {
    const storage = {
      setItem: () => {
        throw new DOMException('Quota exceeded', 'QuotaExceededError')
      },
    }
    expect(() => saveFavourites(storage, new Set(['curry']))).not.toThrow()
  })
})

describe('onlyFavourites', () => {
  it('keeps starred recipes in list order', () => {
    expect(onlyFavourites(recipes, new Set(['tacos', 'carbonara'])).map((r) => r.id)).toEqual(['carbonara', 'tacos'])
  })

  it('is empty with no favourites', () => {
    expect(onlyFavourites(recipes, new Set())).toEqual([])
  })
})
