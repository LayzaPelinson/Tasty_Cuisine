import { useState } from 'react';
import { Link } from 'wouter';
import '../styles/header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/receitas', label: 'Receitas' },
    { href: '/chefes', label: 'Chefes' },
    { href: '/quem-somos', label: 'Quem Somos' },
    { href: '/perfil', label: 'Meu Perfil' },
    { href: '/login', label: 'Login' },
    { href: '/perfil-chefe', label: 'Meu Perfil de Chefe' },
    { href: '/publicar-receita', label: 'Publicar Receita' }
  ];

  return (
    <header className="header">
      <nav className={`nav ${menuOpen ? 'nav-open' : 'nav-closed'}`}>
        <ul>
          {navLinks.map(link => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
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
