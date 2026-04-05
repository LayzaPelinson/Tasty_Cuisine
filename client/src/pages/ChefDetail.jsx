import { useRoute } from 'wouter';
import { chefes, receitas } from '../data/recipes.js';
import { useFavorites } from '../hooks/useFavorites.js';
import RecipeCard from '../components/RecipeCard.jsx';
import '../styles/chef-detail.css';

export default function ChefDetail() {
  const [match, params] = useRoute('/chef/:id');
  const { favorites, toggleFavorite } = useFavorites();
  const goBack = () => window.history.back();

  if (!match || !params?.id) {
    return <div className="chef-detail"><p>Chef não encontrado.</p></div>;
  }

  const chef = chefes[params.id];
  if (!chef) {
    return <div className="chef-detail"><p>Chef não encontrado.</p></div>;
  }

  const chefRecipes = chef.receitas
    .map(id => ({ id, recipe: receitas[id] }))
    .filter(item => item.recipe);

  return (
    <div className="chef-detail">
      <button className="btn-back" onClick={goBack}>
        ← Voltar
      </button>

      <div className="chef-hero">
        <img src={chef.imagem} alt={chef.nome} />
        <div className="chef-info-section">
          <h1>{chef.nome}</h1>
          <p className="specialty">{chef.especialidade}</p>
          <p className="location">📍 {chef.localizacao}</p>
          <p className="bio">{chef.bio}</p>
          <div className="chef-stats">
            <div className="stat">
              <span className="stat-number">{chefRecipes.length}</span>
              <span className="stat-label">Receitas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chef-recipes">
        <h2>Receitas de {chef.nome.split(' ')[0]}</h2>
        <div className="recipes-grid">
          {chefRecipes.map(({ id, recipe }) => (
            <RecipeCard
              key={id}
              recipe={recipe}
              id={id}
              isFavorite={favorites.includes(id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
