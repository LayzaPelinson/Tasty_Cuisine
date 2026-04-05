import { useState } from 'react';
import { useLocation } from 'wouter';
import '../styles/login.css';

export default function Login() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('usuario');
  const [loginMode, setLoginMode] = useState('login');
  const [errorMessage, setErrorMessage] = useState('');

  // Dados de chefes fixos
  const chefesFixos = [
    { email: 'marie@confeitco.com', senha: '123456', tipo: 'chefe', id: 'marie', nome: 'Marie Laurent' },
    { email: 'marco@confeitco.com', senha: '123456', tipo: 'chefe', id: 'marco', nome: 'Marco Bianchi' },
    { email: 'sofia@confeitco.com', senha: '123456', tipo: 'chefe', id: 'sofia', nome: 'Sofia Romano' },
    { email: 'pierre@confeitco.com', senha: '123456', tipo: 'chefe', id: 'pierre', nome: 'Pierre Dubois' }
  ];

  const getUsuarios = () => {
    return JSON.parse(localStorage.getItem('usuarios_cadastrados') || '[{"email":"usuario@email.com","senha":"123456","nome":"Usuário Teste","tipo":"usuario"}]');
  };

  const getChefes = () => {
    return JSON.parse(localStorage.getItem('chefes_cadastrados') || '[]');
  };

  const handleLoginSubmit = (e, tipo) => {
    e.preventDefault();
    setErrorMessage('');

    const emailInput = document.getElementById(`${tipo}-email`);
    const senhaInput = document.getElementById(`${tipo}-senha`);

    if (!emailInput || !senhaInput) return;

    const email = emailInput.value;
    const senha = senhaInput.value;

    const lista = tipo === 'usuario' ? getUsuarios() : [...chefesFixos, ...getChefes()];
    const encontrado = lista.find(u => u.email === email && u.senha === senha);

    if (encontrado) {
      localStorage.setItem('usuarioLogado', JSON.stringify(encontrado));
      if (tipo === 'chefe') {
        setLocation(`/perfil-chefe?id=${encontrado.id}`);
      } else {
        setLocation('/perfil');
      }
    } else {
      setErrorMessage(tipo === 'usuario' ? 'E-mail ou senha incorretos.' : 'Credenciais inválidas para chefe.');
    }
  };

  const handleCadastroSubmit = (e, tipo) => {
    e.preventDefault();
    setErrorMessage('');

    if (tipo === 'usuario') {
      const nome = document.getElementById('cad-usuario-nome')?.value;
      const email = document.getElementById('cad-usuario-email')?.value;
      const senha = document.getElementById('cad-usuario-senha')?.value;

      const lista = getUsuarios();
      if (lista.find(u => u.email === email)) {
        setErrorMessage('Este e-mail já está cadastrado.');
        return;
      }

      const novo = { nome, email, senha, tipo: 'usuario' };
      lista.push(novo);
      localStorage.setItem('usuarios_cadastrados', JSON.stringify(lista));
      localStorage.setItem('usuarioLogado', JSON.stringify(novo));
      setLocation('/perfil');
    } else {
      const nome = document.getElementById('cad-chefe-nome')?.value;
      const especialidade = document.getElementById('cad-chefe-especialidade')?.value;
      const localizacao = document.getElementById('cad-chefe-localizacao')?.value;
      const email = document.getElementById('cad-chefe-email')?.value;
      const senha = document.getElementById('cad-chefe-senha')?.value;

      const lista = getChefes();
      if ([...chefesFixos, ...lista].find(u => u.email === email)) {
        setErrorMessage('Este e-mail já está cadastrado.');
        return;
      }

      const id = 'chef_' + Date.now();
      const novo = { nome, especialidade, localizacao, email, senha, tipo: 'chefe', id };
      lista.push(novo);
      localStorage.setItem('chefes_cadastrados', JSON.stringify(lista));
      localStorage.setItem('usuarioLogado', JSON.stringify(novo));
      setLocation('/perfil-chefe');
    }
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
                <label>
                  E-mail
                  <input type="email" id="usuario-email" placeholder="seu@email.com" required />
                </label>
                <label>
                  Senha
                  <input type="password" id="usuario-senha" placeholder="••••••••" required />
                </label>
                {errorMessage && <p className="login-erro">{errorMessage}</p>}
                <button type="submit" className="btn-login">Entrar</button>
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
