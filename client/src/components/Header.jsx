import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../hooks/useAuth.js';
import '../styles/header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLogged, isChefe } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isLogged');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setMenuOpen(false);
    setLocation('/');
    window.location.reload();
  };

  const navLinks = isLogged
    ? isChefe
      ? [
          { href: '/', label: 'Home' },
          { href: '/receitas', label: 'Receitas' },
          { href: '/chefes', label: 'Chefes' },
          { href: '/quem-somos', label: 'Quem Somos' },
          { href: '/perfil-chefe', label: 'Meu Perfil de Chefe' },
          { href: '/publicar-receita', label: 'Publicar Receita' },
        ]
      : [
          { href: '/', label: 'Home' },
          { href: '/receitas', label: 'Receitas' },
          { href: '/chefes', label: 'Chefes' },
          { href: '/quem-somos', label: 'Quem Somos' },
          { href: '/perfil', label: 'Meu Perfil' },
        ]
    : [
        { href: '/login', label: 'Login' },
      ];

  return (
    <header className="header">
      <Link href="/" className="header-logo">Tasty Cuisine</Link>

      <nav className={`nav ${menuOpen ? 'nav-open' : 'nav-closed'}`}>
        <ul>
          {navLinks.map(link => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
          {isLogged && (
            <li>
              <button onClick={handleLogout} className="nav-logout-btn">
                Sair
              </button>
            </li>
          )}
        </ul>
      </nav>

      <Link href="/" className="logo-link-mobile">
        <span className="logo-text">Tasty Cuisine</span>
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <img src="/images/fechar.png" alt="Fechar menu" />
        ) : (
          <img src="/images/menu.png" alt="Abrir menu" />
        )}
      </button>
    </header>
  );
}
