import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { receitasAPI } from '../lib/api.ts'; 
import { useFavorites, useHistory } from '../hooks/useFavorites.js';
import '../styles/recipe-detail.css';

export default function RecipeDetail() {
  const [match, params] = useRoute('/receita/:id');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useFavorites();
  const { addToHistory } = useHistory();

  const goBack = () => window.history.back();

  useEffect(() => {
    async function getDetail() {
      if (params?.id) {
        const response = await receitasAPI.getById(params.id);
        if (response.data) {
          setRecipe(response.data);
          addToHistory(params.id);
        }
      }
      setLoading(false);
    }
    getDetail();
  }, [params?.id]);

  if (loading) return <div className="recipe-detail"><p>Carregando detalhes...</p></div>;
  if (!recipe) return <div className="recipe-detail"><p>Receita não encontrada.</p></div>;

  const isSaved = favorites.includes(String(recipe.codReceitas));

  return (
    <div className="recipe-detail">
      <button className="btn-back" onClick={goBack}>
        ← Voltar
      </button>

      <div className="recipe-hero">
        <div className="recipe-hero-placeholder" style={{width: '100%', height: '300px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
           🖼️ (Foto da Receita)
        </div>
        <div className="recipe-hero-info">
          <h1>{recipe.nomeReceita}</h1>
          <div className="recipe-badges">
            <span className="badge">Receita da Casa</span>
            <span className="tag tag-medium">Original</span>
          </div>
          <div className="recipe-info">
            <span>⏱ Sob consulta</span>
            <span>👨‍🍳 {recipe.chefe?.nomeCompleto || "Chef Autor"}</span>
          </div>
          <p>{recipe.descricao}</p>
          <div className="recipe-actions">
            <button
              className={`btn-save ${isSaved ? 'saved' : ''}`}
              onClick={() => toggleFavorite(String(recipe.codReceitas))}
            >
              {isSaved ? '♥ Receita Salva' : '♡ Salvar Receita'}
            </button>
          </div>
        </div>
      </div>

      <div className="recipe-details">
        {/* Como o back-end usa Manual2 (NVARCHAR(MAX)), exibimos o texto formatado */}
        <div className="card-config">
          <h3>Modo de Preparo e Instruções</h3>
          <div className="manual-content" style={{ whiteSpace: 'pre-line', padding: '10px' }}>
            {recipe.manual2}
          </div>
        </div>
        
        <div className="card-config">
          <h3>Informações do Chef</h3>
          <p><strong>Publicado por:</strong> {recipe.chefe?.nomeCompleto}</p>
          <p><strong>Contato:</strong> {recipe.chefe?.gmail}</p>
        </div>
      </div>
    </div>
  );
}