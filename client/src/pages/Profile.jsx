import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { receitas } from '../data/recipes.js';
import RecipeCard from '../components/RecipeCard.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import { useHistory } from '../hooks/useFavorites.js';
// Importação corrigida para o caminho que você indicou
import { usuariosAPI, chefesAPI } from '../lib/api.ts'; 
import '../styles/profile.css';

export default function Profile() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('favoritos');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados baseados exatamente nos atributos da sua classe Usuario.java
  const [codUser, setCodUser] = useState(0);
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeDeUsuario, setNomeDeUsuario] = useState('');
  const [idade, setIdade] = useState(14); // Valor mínimo da sua @Min(14)
  const [gmail, setGmail] = useState('');
  const [senha, setSenha] = useState('');
  const [restricoesAlimentares, setRestricoesAlimentares] = useState('');

  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  const { favorites } = useFavorites();
  const { history } = useHistory();

  // Opções de restrições (ajustado para salvar como string única no banco)
  const restricoesOptions = [
    "Vegetariano", "Vegano", "Sem Glúten", "Sem Lactose", "Low Carb", "Diabético"
  ];

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
        setCodUser(d.codUser);
        setNomeCompleto(d.nomeCompleto || '');
        setNomeDeUsuario(d.nomeDeUsuario || '');
        setIdade(d.idade || 14);
        setGmail(d.gmail || '');
        setSenha(d.senha || ''); // Importante manter a senha para o update
        setRestricoesAlimentares(d.restricoesAlimentares || '');
      }
      setLoading(false);
    }
    loadProfile();
  }, [userId, userType, setLocation]);

  const handleSaveProfile = async () => {
    const api = userType === 'chefe' ? chefesAPI : usuariosAPI;
    
    // O Objeto payload agora segue exatamente os nomes da sua Entity Usuario.java
    const payload = {
      codUser: Number(userId),
      nomeCompleto: nomeCompleto,
      nomeDeUsuario: nomeDeUsuario,
      idade: Number(idade), // Garante que não vá 0 para passar na @Min(14)
      gmail: gmail,        // Nome exato do atributo no Java
      senha: senha,        // Enviando a senha atual para não dar erro de NULL no banco
      restricoesAlimentares: restricoesAlimentares
    };

    const response = await api.update(userId, payload);

    if (!response.error) {
      setIsEditing(false);
      localStorage.setItem('userName', nomeCompleto);
      alert("Perfil atualizado com sucesso!");
    } else {
      console.error("Erro no Update:", response.error);
      alert("Erro ao atualizar: Verifique se os dados são válidos.");
    }
  };

  if (loading) return <div className="perfil">Carregando...</div>;

  return (
    <div className="perfil">
      <section className="perfil-header">
        <div className="perfil-info">
          <div className="avatar">👤</div>
          <div>
            <h1>{nomeCompleto}</h1>
            <p>{gmail} | {idade} anos</p>
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
            <input 
              type="text" 
              value={nomeCompleto} 
              onChange={(e) => setNomeCompleto(e.target.value)} 
            />
            
            <label>E-mail (Gmail):</label>
            <input 
              type="email" 
              value={gmail} 
              onChange={(e) => setGmail(e.target.value)} 
            />

            <label>Nome de Usuário:</label>
            <input 
              type="text" 
              value={nomeDeUsuario} 
              onChange={(e) => setNomeDeUsuario(e.target.value)} 
            />

            <label>Restrições Alimentares:</label>
            <input 
              type="text" 
              value={restricoesAlimentares} 
              placeholder="Ex: Sem glúten, Lactose..."
              onChange={(e) => setRestricoesAlimentares(e.target.value)} 
            />
            
            <button className="btn-salvar" onClick={handleSaveProfile}>Salvar Alterações</button>
          </div>
        </section>
      )}

      <nav className="perfil-tabs">
        <button className={activeTab === 'favoritos' ? 'active' : ''} onClick={() => setActiveTab('favoritos')}>❤️ Favoritos</button>
        <button className={activeTab === 'preferencias' ? 'active' : ''} onClick={() => setActiveTab('preferencias')}>⚙️ Configurações</button>
      </nav>

      {activeTab === 'favoritos' && (
        <section className="tab-content">
          <div className="recipes-grid">
            {favorites.map(id => (
              <RecipeCard key={id} recipe={receitas[id]} id={id} isFavorite={true} />
            ))}
          </div>
        </section>
      )}

      {activeTab === 'preferencias' && (
        <section className="tab-content">
          <div className="card-config">
            <h3>Meus Dados</h3>
            <p><strong>Usuário:</strong> {nomeDeUsuario}</p>
            <p><strong>Idade:</strong> {idade} anos</p>
            <p><strong>Restrições:</strong> {restricoesAlimentares || 'Nenhuma'}</p>
            <button className="btn-outline" onClick={() => { localStorage.clear(); setLocation('/login'); }}>Sair da Conta</button>
          </div>
        </section>
      )}
    </div>
  );
}