import { useState } from 'react'
import './App.css'
import { loadFavourites, onlyFavourites, saveFavourites, toggleFavourite } from './favourites'
import { filterRecipes, formatMinutes, recipes } from './recipes'

export default function App() {
  const [query, setQuery] = useState('')
  const [favourites, setFavourites] = useState(() => loadFavourites(localStorage))
  const [favouritesOnly, setFavouritesOnly] = useState(false)

  const matches = filterRecipes(recipes, query)
  const shown = favouritesOnly ? onlyFavourites(matches, favourites) : matches
  const q = query.trim()

  function handleToggle(id: string) {
    const next = toggleFavourite(favourites, id)
    setFavourites(next)
    saveFavourites(localStorage, next)
  }

  function emptyMessage() {
    if (!favouritesOnly) return `No recipes match “${q}”.`
    return q ? `No favourites match “${q}”.` : 'No favourites yet. Star a recipe to see it here.'
  }

  return (
    <main className="page">
      <header className="header">
        <h1>Recipe book</h1>
        <p className="subtitle">Simple dishes for busy evenings.</p>
      </header>

      <div className="toolbar">
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

      {shown.length === 0 ? (
        <p className="empty">{emptyMessage()}</p>
      ) : (
        <ul className="grid">
          {shown.map((r) => {
            const isFav = favourites.has(r.id)
            return (
              <li key={r.id} className="card">
                <div className="card-header">
                  <h2>{r.name}</h2>
                  <button
                    type="button"
                    className="star"
                    aria-pressed={isFav}
                    aria-label={`Favourite ${r.name}`}
                    onClick={() => handleToggle(r.id)}
                  >
                    {isFav ? '★' : '☆'}
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
            )
          })}
        </ul>
      )}
    </main>
  )
}
