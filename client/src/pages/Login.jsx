import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../lib/authService';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeDeUsuario: '',
    senha: ''
  });
  const [userType, setUserType] = useState<'usuario' | 'chefe'>('usuario');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;

      if (userType === 'usuario') {
        result = await authService.loginUsuario(
          formData.nomeDeUsuario,
          formData.senha
        );
      } else {
        result = await authService.loginChefe(
          formData.nomeDeUsuario,
          formData.senha
        );
      }

      if (result.success && result.user) {
        // Salvar no localStorage
        localStorage.setItem('isLogged', 'true');
        localStorage.setItem('userId', String(result.user.id));
        localStorage.setItem('userType', result.user.tipo);
        localStorage.setItem('userName', result.user.nome);
        localStorage.setItem('userEmail', result.user.email);

        console.log('Login bem-sucedido:', result.user);
        navigate('/home');
      } else {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError(
        'Erro ao fazer login: ' +
        (error instanceof Error ? error.message : 'Desconhecido')
      );
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };




  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-tabs">
          <button
            className={`login-tab ${activeTab === 'usuario' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('usuario');
              setLoginMode('login');
              setErrorMessage('');
            }}
          >
            Usuário
          </button>
          <button
            className={`login-tab ${activeTab === 'chefe' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('chefe');
              setLoginMode('login');
              setErrorMessage('');
            }}
          >
            Chefe
          </button>
        </div>

        {/* ===== USUÁRIO ===== */}
        {activeTab === 'usuario' && (
          <div className="painel-usuario">
            {/* Login Usuário */}
            {loginMode === 'login' && (
              <form onSubmit={(e) => handleLoginSubmit(e, 'usuario')} className="login-form">
                <div className="login-avatar">👤</div>
                <h2>Bem-vindo de volta</h2>
                <p className="login-sub">Acesse sua conta para salvar receitas favoritas</p>
                <label htmlFor="nomeDeUsuario">Nome de Usuário</label>
                <input
                  type="text"
                  name="nomeDeUsuario"
                  id="nomeDeUsuario"
                  value={formData.nomeDeUsuario}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

                <label htmlFor="senha">Senha</label>
              <input
                type="password"
                name="senha"
                id="senha"
                value={formData.senha}
                onChange={handleChange}
                required
                disabled={loading}
              />
                {errorMessage && <p className="login-erro">{errorMessage}</p>}

               <button type="submit" className="sign" disabled={loading}>
              {loading ? 'Entrando...' : 'Login'}
            </button>
                <p className="login-rodape">
                  Não tem conta?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); setLoginMode('cadastro'); setErrorMessage(''); }}>
                    Cadastre-se
                  </a>
                </p>
              </form>
            )}



            {/* Cadastro Usuário */}
            {loginMode === 'cadastro' && (
              <form onSubmit={(e) => handleCadastroSubmit(e, 'usuario')} className="login-form">
                <div className="login-avatar">👤</div>
                <h2>Criar Conta</h2>
                <p className="login-sub">Junte-se à comunidade Tasty Cuisine</p>
                <label>
                  Nome
                  <input type="text" id="cad-usuario-nome" placeholder="Seu nome" required />
                </label>
                <label>
                  E-mail
                  <input type="email" id="cad-usuario-email" placeholder="seu@email.com" required />
                </label>
                <label>
                  Senha
                  <input type="password" id="cad-usuario-senha" placeholder="••••••••" required minLength="6" />
                </label>
                {errorMessage && <p className="login-erro">{errorMessage}</p>}
                <button type="submit" className="btn-login">Criar Conta</button>
                <p className="login-rodape">
                  Já tem conta?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); setLoginMode('login'); setErrorMessage(''); }}>
                    Entrar
                  </a>
                </p>
              </form>
            )}
          </div>
        )}

        {/* ===== CHEFE ===== */}
        {activeTab === 'chefe' && (
          <div className="painel-chefe">
            {/* Login Chefe */}
            {loginMode === 'login' && (
              <form onSubmit={(e) => handleLoginSubmit(e, 'chefe')} className="login-form">
                <div className="login-avatar">👨‍🍳</div>
                <h2>Área do Chefe</h2>
                <p className="login-sub">Acesse para gerenciar suas receitas e perfil</p>
                <label>
                  E-mail profissional
                  <input type="email" id="chefe-email" placeholder="chef@confeitco.com" required />
                </label>
                <label>
                  Senha
                  <input type="password" id="chefe-senha" placeholder="••••••••" required />
                </label>
                {errorMessage && <p className="login-erro">{errorMessage}</p>}
                <button type="submit" className="btn-login">Entrar como Chefe</button>
                <p className="login-rodape">
                  Ainda não é cadastrado?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); setLoginMode('cadastro'); setErrorMessage(''); }}>
                    Registre-se
                  </a>
                </p>
              </form>
            )}

            {/* Cadastro Chefe */}
            {loginMode === 'cadastro' && (
              <form onSubmit={(e) => handleCadastroSubmit(e, 'chefe')} className="login-form">
                <div className="login-avatar">👨‍🍳</div>
                <h2>Registrar como Chefe</h2>
                <p className="login-sub">Crie seu perfil profissional na plataforma</p>
                <label>
                  Nome completo
                  <input type="text" id="cad-chefe-nome" placeholder="Chef Marie Laurent" required />
                </label>
                <label>
                  Especialidade
                  <input type="text" id="cad-chefe-especialidade" placeholder="Ex: Culinária Francesa" required />
                </label>
                <label>
                  Localização
                  <input type="text" id="cad-chefe-localizacao" placeholder="Ex: Paris, França" required />
                </label>
                <label>
                  E-mail profissional
                  <input type="email" id="cad-chefe-email" placeholder="chef@confeitco.com" required />
                </label>
                <label>
                  Senha
                  <input type="password" id="cad-chefe-senha" placeholder="••••••••" required minLength="6" />
                </label>
                {errorMessage && <p className="login-erro">{errorMessage}</p>}
                <button type="submit" className="btn-login">Criar Perfil de Chefe</button>
                <p className="login-rodape">
                  Já tem conta?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); setLoginMode('login'); setErrorMessage(''); }}>
                    Entrar
                  </a>
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
