import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

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

  it('summarizes the visible recipes as you type', () => {
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent('6 recipes · 3 h 15 min')

    const search = screen.getByLabelText('Search recipes')
    fireEvent.change(search, { target: { value: 'quick' } })
    expect(screen.getByRole('status')).toHaveTextContent('2 recipes · 45 min')

    fireEvent.change(search, { target: { value: 'pizza' } })
    expect(screen.getByRole('status')).toHaveTextContent(/^No recipes$/)
  })
})
