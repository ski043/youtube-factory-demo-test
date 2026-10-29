import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { FAVOURITES_KEY } from './favourites'

beforeEach(() => localStorage.clear())

function headings() {
  return screen.queryAllByRole('heading', { level: 2 }).map((h) => h.textContent)
}

describe('App', () => {
  it('shows every recipe, then filters as you type', () => {
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(6)

    fireEvent.change(screen.getByLabelText('Search recipes'), { target: { value: 'quick' } })
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Spaghetti carbonara', 'Fish tacos'])
  })

  it('says so when nothing matches', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Search recipes'), { target: { value: 'pizza' } })
    expect(screen.getByText('No recipes match “pizza”.')).toBeInTheDocument()
  })

  it('stars a recipe and saves it to local storage', () => {
    render(<App />)
    const star = screen.getByRole('button', { name: 'Favourite Shakshuka' })
    expect(star).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(star)
    expect(star).toHaveAttribute('aria-pressed', 'true')
    expect(star).toHaveTextContent('★')
    expect(JSON.parse(localStorage.getItem(FAVOURITES_KEY) ?? 'null')).toEqual(['shakshuka'])

    fireEvent.click(star)
    expect(star).toHaveAttribute('aria-pressed', 'false')
    expect(JSON.parse(localStorage.getItem(FAVOURITES_KEY) ?? 'null')).toEqual([])
  })

  it('keeps favourites after a reload', () => {
    const first = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Favourite Miso ramen' }))
    first.unmount()

    render(<App />)
    expect(screen.getByRole('button', { name: 'Favourite Miso ramen' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Favourite Fish tacos' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('combines Favourites only with the search', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Favourite Fish tacos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Favourite Chickpea curry' }))

    fireEvent.click(screen.getByLabelText('Favourites only'))
    expect(headings()).toEqual(['Chickpea curry', 'Fish tacos'])

    fireEvent.change(screen.getByLabelText('Search recipes'), { target: { value: 'quick' } })
    expect(headings()).toEqual(['Fish tacos'])

    fireEvent.change(screen.getByLabelText('Search recipes'), { target: { value: 'pasta' } })
    expect(screen.getByText('No favourites match “pasta”.')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Favourites only'))
    expect(headings()).toEqual(['Spaghetti carbonara'])
  })

  it('explains an empty favourites list', () => {
    render(<App />)
    fireEvent.click(screen.getByLabelText('Favourites only'))
    expect(screen.getByText('No favourites yet. Star a recipe to see it here.')).toBeInTheDocument()
  })
})
