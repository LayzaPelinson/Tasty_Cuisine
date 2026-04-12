import { Link } from 'wouter';
import { receitas } from '../data/recipes.js';
import { useFavorites } from '../hooks/useFavorites.js';
import { useAuth } from '../hooks/useAuth.js';
import { getReceitasMaisPopulares } from '../lib/popularity.js';
import RecipeCard from '../components/RecipeCard.jsx';
import '../styles/home.css';

export default function Home() {
  const { favorites, toggleFavorite } = useFavorites();
  const { isLogged } = useAuth();
  const highlightRecipes = getReceitasMaisPopulares(4, favorites);

  return (
    <div className="home">
      <section className="presentation">
        <div className="presentation-text">
          <div className="tag-intro">Receitas Saudáveis</div>
          <h1>Bem-vindos à Tasty Cuisine!</h1>
          <p>Descubra receitas saudáveis que elevam o simples ao especial. Feitas para tornar cada momento mais especial.</p>
          <div className="button-group">
            <Link
              href={isLogged ? "/receitas" : "/login"}
              className={`btn btn-primary${!isLogged ? ' btn-locked' : ''}`}
            >
              Explorar Receitas
            </Link>
            <Link
              href={isLogged ? "/chefes" : "/login"}
              className={`btn btn-secondary${!isLogged ? ' btn-locked' : ''}`}
            >
              Conhecer Chefes
            </Link>
          </div>
        </div>
        <div className="presentation-images">
          <img src="/images/receita1.jpg" alt="Receita Saudável" />
          <img src="/images/receita2.jpg" alt="Receita Saudável" />
          <img src="/images/receita3.jpg" alt="Vitrine de doces" />
        </div>
      </section>

      <section className="highlights">
        <div className="highlights-header">
          <h2>Receitas em Destaque</h2>
          <p>As mais populares da nossa comunidade.</p>
        </div>
        {isLogged ? (
          <div className="recipes-grid">
            {highlightRecipes.map(id => (
              <RecipeCard
                key={id}
                recipe={receitas[id]}
                id={id}
                isFavorite={favorites.includes(id)}
                onToggleFavorite={toggleFavorite}
                isHighlight={true}
              />
            ))}
          </div>
        ) : (
          <div className="recipes-grid">
            {highlightRecipes.map(id => (
              <a key={id} href="/login" className="locked-card">
                <div className="locked-overlay">
                  <span>🔒</span>
                  <p>Faça login para ver</p>
                </div>
                <div className="recipe-card-image">
                  <img src={receitas[id]?.imagem} alt={receitas[id]?.nome} />
                </div>
                <div className="recipe-card-content">
                  <h3>{receitas[id]?.nome}</h3>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
