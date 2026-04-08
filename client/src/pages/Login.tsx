import { useState } from 'react';
import { useLocation } from 'wouter';
import { authService } from '../lib/authService';
import '../styles/login.css';

export default function Login() {
  const [location, setLocation] = useLocation();
  const VITE_ANALYTICS_ENDPOINT="https://sua-url-de-analytics.com"
  // Estados principais (conforme sua estrutura original)
  const [formData, setFormData] = useState({
    nomeDeUsuario: '',
    senha: ''
  });
  const [userType, setUserType] = useState<'usuario' | 'chefe'>('usuario');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado adicional para controlar se mostra Login ou Cadastro

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
        localStorage.setItem('isLogged', 'true');
        localStorage.setItem('userId', String(result.user.id));
        localStorage.setItem('userType', result.user.tipo);
        localStorage.setItem('userName', result.user.nome);
        localStorage.setItem('userEmail', result.user.email);

        console.log('Login bem-sucedido:', result.user);
        setLocation('/');
      } else {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError(
        'Erro ao fazer login: ' +
        (err instanceof Error ? err.message : 'Desconhecido')
      );
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-tabs">
          <button
            className={`login-tab ${userType === 'usuario' ? 'active' : ''}`}
            onClick={() => {
              setUserType('usuario');
              setError(null);
            }}
          >
            Usuário
          </button>
          <button
            className={`login-tab ${userType === 'chefe' ? 'active' : ''}`}
            onClick={() => {
              setUserType('chefe');
              setError(null);
            }}
          >
            Chefe
          </button>
        </div>

        <div className={`painel-${userType}`}>
          { (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-avatar">{userType === 'usuario' ? '👤' : '👨‍🍳'}</div>
              <h2>{userType === 'usuario' ? 'Bem-vindo de volta' : 'Área do Chefe'}</h2>
              <p className="login-sub">
                {userType === 'usuario' 
                  ? 'Acesse sua conta para salvar receitas favoritas' 
                  : 'Acesse para gerenciar suas receitas e perfil'}
              </p>

              <label htmlFor="nomeDeUsuario">
                {userType === 'usuario' ? 'Nome de Usuário' : 'E-mail profissional'}
              </label>
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

              {error && <p className="login-erro">{error}</p>}

              <button type="submit" className="sign" disabled={loading}>
                {loading ? 'Entrando...' : userType === 'usuario' ? 'Login' : 'Entrar como Chefe'}
              </button>

              <p className="login-rodape">
                {userType === 'usuario' ? 'Não tem conta?' : 'Ainda não é cadastrado?'}{' '}
                <a href="#" onClick={(e) => { setLocation("/cadastro") }}>
                  {userType === 'usuario' ? 'Cadastre-se' : 'Registre-se'}
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}