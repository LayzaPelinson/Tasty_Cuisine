import { useRoute } from 'wouter';
import { receitas } from '../data/recipes.js';
import { useFavorites } from '../hooks/useFavorites.js';
import { useHistory } from '../hooks/useFavorites.js';
import RecipeCard from '../components/RecipeCard.jsx';
import '../styles/recipe-detail.css';

export default function RecipeDetail() {
  const [match, params] = useRoute('/receita/:id');
  const goBack = () => window.history.back();
  const { favorites, toggleFavorite } = useFavorites();
  const { addToHistory } = useHistory();

  if (!match || !params?.id) {
    return <div className="recipe-detail"><p>Receita não encontrada.</p></div>;
  }

  const recipe = receitas[params.id];
  if (!recipe) {
    return <div className="recipe-detail"><p>Receita não encontrada.</p></div>;
  }

  addToHistory(params.id);

  const isSaved = favorites.includes(params.id);
  const relatedRecipes = recipe.relacionadas
    .map(id => ({ id, recipe: receitas[id] }))
    .filter(item => item.recipe);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.nome,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      alert('Link copiado para a área de transferência!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="recipe-detail">
      <button className="btn-back" onClick={goBack}>
        ← Voltar
      </button>

      <div className="recipe-hero">
        <img src={recipe.imagem} alt={recipe.nome} />
        <div className="recipe-hero-info">
          <h1>{recipe.nome}</h1>
          <div className="recipe-badges">
            <span className="badge">{recipe.categoria}</span>
            <span className={`tag ${recipe.dificuldade === 'Fácil' ? 'tag-easy' : recipe.dificuldade === 'Médio' ? 'tag-medium' : 'tag-hard'}`}>
              {recipe.dificuldade}
            </span>
          </div>
          <div className="recipe-info">
            <span>⏱ {recipe.tempo}</span>
            <span>👨🍳 {recipe.chef}</span>
          </div>
          <p>{recipe.descricao}</p>
          <div className="recipe-actions">
            <button
              className={`btn-save ${isSaved ? 'saved' : ''}`}
              onClick={() => toggleFavorite(params.id)}
            >
              {isSaved ? '♥ Receita Salva' : '♡ Salvar Receita'}
            </button>
            <button className="btn-share" onClick={handleShare}>
              ⬆ Compartilhar
            </button>
          </div>
        </div>
      </div>

      <div className="recipe-details">
        <div className="card-config">
          <h3>Ingredientes</h3>
          <ul className="lista-verde">
            {recipe.ingredientes.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>
        <div className="card-config">
          <h3>Modo de Preparo</h3>
          <ol className="lista-numerada">
            {recipe.preparo.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.dica && (
        <div className="recipe-tip">
          <h3>💡 Dica do Chef</h3>
          <p>{recipe.dica}</p>
        </div>
      )}

      {relatedRecipes.length > 0 && (
        <div className="related-recipes">
          <h2>Receitas Relacionadas</h2>
          <div className="related-grid">
            {relatedRecipes.map(({ id, recipe: relRecipe }) => (
              <RecipeCard
                key={id}
                recipe={relRecipe}
                id={id}
                isFavorite={favorites.includes(id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
