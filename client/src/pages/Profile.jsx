import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { receitas } from '../data/recipes.js';
import RecipeCard from '../components/RecipeCard.jsx';
import { useFavorites, useHistory } from '../hooks/useFavorites.js';
import { usuariosAPI, chefesAPI } from '../lib/api.ts'; 
import '../styles/profile.css';

export default function Profile() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('favoritos');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estado unificado para os dados do perfil
  const [formData, setFormData] = useState({
    id: 0,
    nomeCompleto: '',
    username: '', // Abstração para nomeDeUsuario ou nomeUsuario
    idade: 14,
    gmail: '',
    senha: '',
    restricoesAlimentares: '',
    fotoPerfil: null
  });

  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType'); // 'chefe' ou 'usuario'
  const { favorites } = useFavorites();

  useEffect(() => {
    async function loadProfile() {
      if (!userId) {
        setLocation('/login');
        return;
      }
      
      const api = userType === 'chefe' ? chefesAPI : usuariosAPI;
      const response = await api.getById(userId);

      if (response.data) {
        const d = response.data;
        // Mapeia os dados do back-end (que variam por entidade) para o estado do React
        setFormData({
          id: userType === 'chefe' ? d.codChefe : d.codUser,
          nomeCompleto: d.nomeCompleto || '',
          username: userType === 'chefe' ? d.nomeUsuario : d.nomeDeUsuario,
          idade: d.idade || 14,
          gmail: d.gmail || '',
          senha: d.senha || '',
          restricoesAlimentares: d.restricoesAlimentares || '',
          fotoPerfil: d.fotoPerfil || null
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, [userId, userType, setLocation]);

  const handleSaveProfile = async () => {
    const api = userType === 'chefe' ? chefesAPI : usuariosAPI;
    
    // Constrói o payload respeitando os nomes exatos das classes Java
    let payload = {};
    
    if (userType === 'chefe') {
      payload = {
        codChefe: Number(userId),
        nomeUsuario: formData.username,
        nomeCompleto: formData.nomeCompleto,
        idade: Number(formData.idade),
        gmail: formData.gmail,
        senha: formData.senha,
        fotoPerfil: formData.fotoPerfil
      };
    } else {
      payload = {
        codUser: Number(userId),
        nomeDeUsuario: formData.username,
        nomeCompleto: formData.nomeCompleto,
        idade: Number(formData.idade),
        gmail: formData.gmail,
        senha: formData.senha,
        restricoesAlimentares: formData.restricoesAlimentares
      };
    }

    const response = await api.update(userId, payload);

    if (!response.error) {
      setIsEditing(false);
      localStorage.setItem('userName', formData.nomeCompleto);
      alert("Perfil atualizado com sucesso!");
    } else {
      console.error("Erro no Update:", response.error);
      alert("Erro ao atualizar: Verifique os dados.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="perfil">Carregando...</div>;

  return (
    <div className="perfil">
      <section className="perfil-header">
        <div className="perfil-info">
          <div className="avatar">{userType === 'chefe' ? '👨‍🍳' : '👤'}</div>
          <div>
            <h1>{formData.nomeCompleto}</h1>
            <p>{formData.gmail} | {userType === 'chefe' ? 'Chef Profissional' : `${formData.idade} anos`}</p>
          </div>
        </div>
        <button className="btn-editar" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancelar' : '✏️ Editar Perfil'}
        </button>
      </section>

      {isEditing && (
        <section className="perfil-edicao">
          <div className="inputs">
            <label>Nome Completo:</label>
            <input name="nomeCompleto" type="text" value={formData.nomeCompleto} onChange={handleChange} />
            
            <label>E-mail (Gmail):</label>
            <input name="gmail" type="email" value={formData.gmail} onChange={handleChange} />

            <label>Nome de Usuário:</label>
            <input name="username" type="text" value={formData.username} onChange={handleChange} />

            <label>Idade:</label>
            <input name="idade" type="number" value={formData.idade} onChange={handleChange} />

            {/* Campo condicional: Apenas para Usuários comuns */}
            {userType !== 'chefe' && (
              <>
                <label>Restrições Alimentares:</label>
                <input 
                  name="restricoesAlimentares"
                  type="text" 
                  value={formData.restricoesAlimentares} 
                  placeholder="Ex: Sem glúten, Lactose..."
                  onChange={handleChange} 
                />
              </>
            )}
            
            <button className="btn-salvar" onClick={handleSaveProfile}>Salvar Alterações</button>
          </div>
        </section>
      )}

      <nav className="perfil-tabs">
        <button className={activeTab === 'favoritos' ? 'active' : ''} onClick={() => setActiveTab('favoritos')}>
          {userType === 'chefe' ? '👨‍🍳 Minhas Receitas' : '❤️ Favoritos'}
        </button>
        <button className={activeTab === 'preferencias' ? 'active' : ''} onClick={() => setActiveTab('preferencias')}>⚙️ Configurações</button>
      </nav>

      {activeTab === 'favoritos' && (
        <section className="tab-content">
          <div className="recipes-grid">
            {favorites.length > 0 ? (
              favorites.map(id => (
                <RecipeCard key={id} recipe={receitas[id]} id={id} isFavorite={true} />
              ))
            ) : (
              <p>Nenhuma receita encontrada.</p>
            )}
          </div>
        </section>
      )}

      {activeTab === 'preferencias' && (
        <section className="tab-content">
          <div className="card-config">
            <h3>Meus Dados</h3>
            <p><strong>Tipo de Conta:</strong> {userType.toUpperCase()}</p>
            <p><strong>Usuário:</strong> {formData.username}</p>
            {userType !== 'chefe' && <p><strong>Restrições:</strong> {formData.restricoesAlimentares || 'Nenhuma'}</p>}
            <button className="btn-outline" onClick={() => { localStorage.clear(); setLocation('/login'); }}>Sair da Conta</button>
          </div>
        </section>
      )}
    </div>
  );
}