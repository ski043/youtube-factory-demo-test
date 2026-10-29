import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

const names = () => screen.queryAllByRole('heading', { level: 2 }).map((h) => h.textContent)

beforeEach(() => localStorage.clear())

describe('App', () => {
  it('shows every recipe, then filters as you type', () => {
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(6)

    fireEvent.change(screen.getByLabelText('Search recipes'), { target: { value: 'quick' } })
    expect(names()).toEqual(['Spaghetti carbonara', 'Fish tacos'])
  })

  it('says so when nothing matches', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Search recipes'), { target: { value: 'pizza' } })
    expect(screen.getByText('No recipes match “pizza”.')).toBeInTheDocument()
  })

  it('keeps starred recipes after a reload', () => {
    const { unmount } = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Favourite Fish tacos' }))
    expect(screen.getByRole('button', { name: 'Favourite Fish tacos' })).toHaveAttribute('aria-pressed', 'true')
    unmount()

    render(<App />)
    expect(screen.getByRole('button', { name: 'Favourite Fish tacos' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Favourite Shakshuka' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows only favourites when toggled, together with the search', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Favourite Fish tacos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Favourite Miso ramen' }))
    fireEvent.click(screen.getByLabelText('Favourites only'))
    expect(names()).toEqual(['Fish tacos', 'Miso ramen'])
    expect(screen.getByRole('status')).toHaveTextContent('2 recipes · 55 min')

    fireEvent.change(screen.getByLabelText('Search recipes'), { target: { value: 'quick' } })
    expect(names()).toEqual(['Fish tacos'])

    fireEvent.change(screen.getByLabelText('Search recipes'), { target: { value: 'pasta' } })
    expect(screen.getByText('No favourites match “pasta”.')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Favourites only'))
    expect(names()).toEqual(['Spaghetti carbonara'])
  })

  it('unstarring under the filter removes the recipe', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Favourite Shakshuka' }))
    fireEvent.click(screen.getByLabelText('Favourites only'))
    fireEvent.click(screen.getByRole('button', { name: 'Favourite Shakshuka' }))
    expect(screen.getByText('No favourites yet. Star a recipe to add it here.')).toBeInTheDocument()
  })

  it('summarises the visible recipes and updates while typing', () => {
    render(<App />)
    const search = screen.getByLabelText('Search recipes')
    const summary = screen.getByRole('status')
    expect(summary).toHaveTextContent('6 recipes · 3 h 15 min')

    fireEvent.change(search, { target: { value: 'vegetarian' } })
    expect(summary).toHaveTextContent('2 recipes · 1 h 15 min')

    fireEvent.change(search, { target: { value: 'tacos' } })
    expect(summary).toHaveTextContent('1 recipe · 20 min')

    fireEvent.change(search, { target: { value: 'pizza' } })
    expect(summary).toHaveTextContent('No recipes')
  })
})
