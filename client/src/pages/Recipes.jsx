import { useState, useMemo } from 'react';
import { receitas } from '../data/recipes.js';
import { useFavorites } from '../hooks/useFavorites.js';
import RecipeCard from '../components/RecipeCard.jsx';
import '../styles/recipes.css';

export default function Recipes() {
  const { favorites, toggleFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return Object.entries(receitas);

    return Object.entries(receitas).filter(([, recipe]) => {
      return (
        recipe.nome.toLowerCase().includes(term) ||
        recipe.chef.toLowerCase().includes(term) ||
        recipe.ingredientes.some(i => i.toLowerCase().includes(term))
      );
    });
  }, [searchTerm]);

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <h1>Nossas Receitas</h1>
        <p>Explore nossa coleção de receitas saudáveis.</p>
      </div>

      <div className="search-container">
        <i className="search-icon">🔍</i>
        <input
          type="text"
          placeholder="Buscar por nome, chef ou ingredientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="recipes-grid">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(([id, recipe]) => (
            <RecipeCard
              key={id}
              recipe={recipe}
              id={id}
              isFavorite={favorites.includes(id)}
              onToggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <div className="no-results">
            <p>Nenhuma receita encontrada. Tente outro termo de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
}
