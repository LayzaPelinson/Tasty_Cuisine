import { Link } from 'wouter';
import '../styles/recipe-card.css';

export default function RecipeCard({
  recipe,
  id,
  isFavorite,
  onToggleFavorite,
  isHighlight = false
}) {
  const getDifficultyClass = (difficulty) => {
    if (difficulty === 'Fácil') return 'tag-easy';
    if (difficulty === 'Médio') return 'tag-medium';
    return 'tag-hard';
  };

  return (
    <Link href={`/receita/${id}`}>
      <article className={`recipe-card ${isHighlight ? 'recipe-card-highlight' : ''}`}>
        <div className="recipe-card-image">
          <span className="badge">{recipe.categoria}</span>
          <button
            className="favorite-btn"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(id);
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
          <img src={recipe.imagem} alt={recipe.nome} />
        </div>
        <div className="recipe-card-content">
          <h3>{recipe.nome}</h3>
          <div className="recipe-info">
            <span>⏱ {recipe.tempo}</span>
            <span>👨🍳 {recipe.chef}</span>
          </div>
          <span className={`tag ${getDifficultyClass(recipe.dificuldade)}`}>
            {recipe.dificuldade}
          </span>
        </div>
      </article>
    </Link>
  );
}
