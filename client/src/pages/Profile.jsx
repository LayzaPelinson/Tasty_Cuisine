import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { receitas } from '../data/recipes.js';
import RecipeCard from '../components/RecipeCard.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import { useHistory } from '../hooks/useFavorites.js';
import '../styles/profile.css';

export default function Profile() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('favoritos');
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('Layza Pelinson');
  const [userEmail, setUserEmail] = useState('layza@email.com');
  const [preferencias, setPreferencias] = useState([]);
  const [editingPreferencias, setEditingPreferencias] = useState([]);
  const { favorites } = useFavorites();
  const { history } = useHistory();

  const preferenciasOptions = [
    { id: 'vegetariano', label: 'Vegetariano' },
    { id: 'vegano', label: 'Vegano' },
    { id: 'sem-gluten', label: 'Sem Glúten' },
    { id: 'sem-lactose', label: 'Sem Lactose' },
    { id: 'low-carb', label: 'Low Carb' },
    { id: 'proteina-alta', label: 'Proteína Alta' },
    { id: 'organico', label: 'Orgânico' },
    { id: 'diabetico', label: 'Diabético' }
  ];

  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem('preferenciasAlimentares') || '[]');
    setPreferencias(savedPrefs);
    setEditingPreferencias(savedPrefs);
  }, []);

  const handleEditClick = () => {
    setEditingPreferencias([...preferencias]);
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    localStorage.setItem('preferenciasAlimentares', JSON.stringify(editingPreferencias));
    setPreferencias(editingPreferencias);
    setIsEditing(false);
  };

  const togglePreferencia = (id) => {
    setEditingPreferencias(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const favoriteRecipes = favorites
    .map(id => ({ id, recipe: receitas[id] }))
    .filter(item => item.recipe);

  const historyRecipes = history
    .map(id => ({ id, recipe: receitas[id] }))
    .filter(item => item.recipe);

  return (
    <div className="perfil">
      {/* HEADER PERFIL */}
      <section className="perfil-header">
        <div className="perfil-info">
          <div className="avatar">👤</div>
          <div>
            <h1>{userName}</h1>
            <p>{userEmail}</p>
          </div>
        </div>
        <button className="btn-editar" onClick={handleEditClick}>
          ✏️ Editar Perfil
        </button>
      </section>

      {/* EDIÇÃO */}
      {isEditing && (
        <section className="perfil-edicao">
          <div className="perfil-info">
            <div className="avatar">👤</div>
            <div className="inputs">
              <input
                type="text"
                placeholder="Nome"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="email"
                placeholder="E-mail"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <div style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                  Preferências Alimentares:
                </label>
                <div className="preferencias-edicao">
                  {preferenciasOptions.map(pref => (
                    <span
                      key={pref.id}
                      className={`tag-editavel ${editingPreferencias.includes(pref.id) ? 'ativo' : ''}`}
                      onClick={() => togglePreferencia(pref.id)}
                    >
                      {pref.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button className="btn-salvar" onClick={handleSaveProfile}>
            Salvar
          </button>
        </section>
      )}

      {/* ABAS */}
      <nav className="perfil-tabs">
        <button
          className={activeTab === 'favoritos' ? 'active' : ''}
          onClick={() => setActiveTab('favoritos')}
        >
          ❤️ Favoritos
        </button>
        <button
          className={activeTab === 'historico' ? 'active' : ''}
          onClick={() => setActiveTab('historico')}
        >
          🕒 Histórico
        </button>
        <button
          className={activeTab === 'preferencias' ? 'active' : ''}
          onClick={() => setActiveTab('preferencias')}
        >
          ⚙️ Preferências
        </button>
      </nav>

      {/* FAVORITOS */}
      {activeTab === 'favoritos' && (
        <section className="favoritos tab-content">
          <div className="titulo">
            <h2>Receitas Favoritas</h2>
          </div>
          {favoriteRecipes.length > 0 ? (
            <div className="recipes-grid">
                {favoriteRecipes.map(({ id, recipe }) => (
                  <RecipeCard
                    key={id}
                    recipe={recipe}
                    id={id}
                    isFavorite={true}
                  />
                ))}
            </div>
          ) : (
            <p style={{ color: '#888' }}>Nenhuma receita favorita ainda.</p>
          )}
        </section>
      )}

      {/* HISTÓRICO */}
      {activeTab === 'historico' && (
        <section className="historico tab-content">
          <div className="titulo">
            <h2>Histórico Recente</h2>
          </div>
          {historyRecipes.length > 0 ? (
            <div className="recipes-grid">
                {historyRecipes.map(({ id, recipe }) => (
                  <RecipeCard
                    key={id}
                    recipe={recipe}
                    id={id}
                    isFavorite={favorites.includes(id)}
                  />
                ))}
            </div>
          ) : (
            <p style={{ color: '#888' }}>Nenhuma receita visualizada ainda.</p>
          )}
        </section>
      )}

      {/* PREFERÊNCIAS */}
      {activeTab === 'preferencias' && (
        <section className="configuracoes tab-content">
          <div className="card-config">
            <h3>Preferências Alimentares</h3>
            <p>Suas preferências selecionadas para sugestões personalizadas.</p>
            <div className="tags" id="preferencias-selecionadas">
              {preferencias.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic' }}>
                  Nenhuma preferência selecionada. Edite seu perfil para adicionar.
                </p>
              ) : (
                preferencias.map(pref => {
                  const label = preferenciasOptions.find(p => p.id === pref)?.label || pref;
                  return (
                    <span key={pref} className="tag ativo">
                      {label}
                    </span>
                  );
                })
              )}
            </div>
          </div>

          <div className="card-config">
            <h3>Notificações</h3>
            <div className="linha">
              <div>
                <strong>Novas receitas</strong>
                <p>Receba alertas de novas receitas</p>
              </div>
              <button className="btn-outline">Ativar</button>
            </div>
            <div className="linha">
              <div>
                <strong>Dicas semanais</strong>
                <p>Receba dicas culinárias por email</p>
              </div>
              <button className="btn-outline">Ativar</button>
            </div>
          </div>

          <div className="card-config full">
            <h3>Conta</h3>
            <button className="btn-outline">Alterar Senha</button>
            <button className="btn-danger" onClick={() => {
              localStorage.removeItem('usuarioLogado');
              setLocation('/login');
            }}>
              Sair da Conta
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
