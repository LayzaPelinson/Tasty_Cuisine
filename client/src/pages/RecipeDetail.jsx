import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { receitas } from '../data/recipes.js';
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
      if (!params?.id) { setLoading(false); return; }

      const response = await receitasAPI.getById(params.id);
      if (response.data) {
        setRecipe(response.data);
        addToHistory(params.id);
        setLoading(false);
        return;
      }

      const local = receitas[params.id];
      if (local) {
        setRecipe({
          nomeReceita: local.nome,
          descricao: local.descricao,
          manual2: local.preparo?.join('\n') || '',
          imagem: local.imagem,
          tempo: local.tempo,
          dificuldade: local.dificuldade,
          categoria: local.categoria,
          ingredientes: local.ingredientes,
          dica: local.dica,
          chefe: { nomeCompleto: local.chef },
          codReceitas: params.id,
          _isLocal: true,
        });
        addToHistory(params.id);
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
      <button className="btn-back" onClick={goBack}>← Voltar</button>

      <div className="recipe-hero">
        {recipe.imagem
          ? <img src={recipe.imagem} alt={recipe.nomeReceita} />
          : <div style={{width: '50%', height: '500px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🖼️</div>
        }
        <div className="recipe-hero-info">
          <h1>{recipe.nomeReceita}</h1>
          <div className="recipe-badges">
            {recipe.categoria && <span className="badge">{recipe.categoria}</span>}
            {recipe.dificuldade && <span className="tag tag-medium">{recipe.dificuldade}</span>}
          </div>
          <div className="recipe-info">
            {recipe.tempo && <span>⏱ {recipe.tempo}</span>}
            <span>👨‍🍳 {recipe.chefe?.nomeCompleto || 'Chef Autor'}</span>
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
        {recipe._isLocal ? (
          <>
            <div className="card-config">
              <h3>Ingredientes</h3>
              <ul className="lista-verde">
                {recipe.ingredientes?.map((ing, i) => <li key={i}>{ing}</li>)}
              </ul>
            </div>
            <div className="card-config">
              <h3>Modo de Preparo</h3>
              <ol className="lista-numerada">
                {recipe.manual2?.split('\n').map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {recipe.dica && (
        <div className="recipe-tip">
          <h3>💡 Dica do Chef</h3>
          <p>{recipe.dica}</p>
        </div>
      )}
    </div>
  );
}
