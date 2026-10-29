import { useState } from 'react'
import './App.css'
import { filterRecipes, formatMinutes, recipes, summarizeRecipes } from './recipes'

export default function App() {
  const [query, setQuery] = useState('')
  const shown = filterRecipes(recipes, query)

  return (
    <main className="page">
      <header className="header">
        <h1>Recipe book</h1>
        <p className="subtitle">Simple dishes for busy evenings.</p>
      </header>

      <input
        className="search"
        type="search"
        placeholder="Search recipes or tags"
        aria-label="Search recipes"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <p className="summary" role="status">
        {summarizeRecipes(shown)}
      </p>

      {shown.length === 0 ? (
        <p className="empty">No recipes match “{query.trim()}”.</p>
      ) : (
        <ul className="grid">
          {shown.map((r) => (
            <li key={r.id} className="card">
              <h2>{r.name}</h2>
              <p className="meta">
                {formatMinutes(r.minutes)} · {r.servings} servings
              </p>
              <ul className="tags">
                {r.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
