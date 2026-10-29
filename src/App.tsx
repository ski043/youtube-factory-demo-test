import { useState } from 'react'
import './App.css'
import { loadFavourites, onlyFavourites, saveFavourites, toggleFavourite } from './favourites'
import { filterRecipes, formatMinutes, recipes, summarizeRecipes } from './recipes'

export default function App() {
  const [query, setQuery] = useState('')
  const [favourites, setFavourites] = useState(() => loadFavourites(localStorage))
  const [favouritesOnly, setFavouritesOnly] = useState(false)
  const shown = filterRecipes(favouritesOnly ? onlyFavourites(recipes, favourites) : recipes, query)

  function toggle(id: string) {
    const next = toggleFavourite(favourites, id)
    saveFavourites(localStorage, next)
    setFavourites(next)
  }

  const emptyMessage = favouritesOnly
    ? query.trim()
      ? `No favourites match “${query.trim()}”.`
      : 'No favourites yet. Star a recipe to add it here.'
    : `No recipes match “${query.trim()}”.`

  return (
    <main className="page">
      <header className="header">
        <h1>Recipe book</h1>
        <p className="subtitle">Simple dishes for busy evenings.</p>
      </header>

      <div className="controls">
        <input
          className="search"
          type="search"
          placeholder="Search recipes or tags"
          aria-label="Search recipes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="favourites-only">
          <input type="checkbox" checked={favouritesOnly} onChange={(e) => setFavouritesOnly(e.target.checked)} />
          Favourites only
        </label>
      </div>

      <p className="summary" role="status">
        {summarizeRecipes(shown)}
      </p>

      {shown.length === 0 ? (
        <p className="empty">{emptyMessage}</p>
      ) : (
        <ul className="grid">
          {shown.map((r) => (
            <li key={r.id} className="card">
              <div className="card-head">
                <h2>{r.name}</h2>
                <button
                  type="button"
                  className="star"
                  aria-label={`Favourite ${r.name}`}
                  aria-pressed={favourites.has(r.id)}
                  onClick={() => toggle(r.id)}
                >
                  {favourites.has(r.id) ? '★' : '☆'}
                </button>
              </div>
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
