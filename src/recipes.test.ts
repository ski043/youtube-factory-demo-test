import { describe, expect, it } from 'vitest'
import { filterRecipes, formatMinutes, recipes, summarizeRecipes } from './recipes'

describe('filterRecipes', () => {
  it('returns every recipe for an empty query', () => {
    expect(filterRecipes(recipes, '  ')).toHaveLength(recipes.length)
  })

  it('matches names and tags, ignoring case', () => {
    expect(filterRecipes(recipes, 'RAMEN').map((r) => r.id)).toEqual(['ramen'])
    expect(filterRecipes(recipes, 'vegetarian').map((r) => r.id)).toEqual(['shakshuka', 'risotto'])
  })
})

describe('formatMinutes', () => {
  it('formats minutes and hours', () => {
    expect(formatMinutes(25)).toBe('25 min')
    expect(formatMinutes(60)).toBe('1 h')
    expect(formatMinutes(65)).toBe('1 h 5 min')
  })
})

describe('summarizeRecipes', () => {
  it('counts the recipes and totals their cooking time', () => {
    expect(summarizeRecipes(recipes)).toBe('6 recipes · 3 h 15 min')
    expect(summarizeRecipes(filterRecipes(recipes, 'quick'))).toBe('2 recipes · 45 min')
    expect(summarizeRecipes(filterRecipes(recipes, 'ramen'))).toBe('1 recipe · 35 min')
  })

  it('says "No recipes" for an empty list', () => {
    expect(summarizeRecipes([])).toBe('No recipes')
  })
})
