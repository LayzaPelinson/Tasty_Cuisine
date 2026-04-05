import { Link } from 'wouter';
import '../styles/chef-card.css';

export default function ChefCard({ chef, id }) {
  return (
    <Link href={`/chef/${id}`}>
      <article className="chef-card">
        <div className="chef-image">
          <img src={chef.imagem} alt={chef.nome} />
          <div className="overlay">
            <h3>{chef.nome}</h3>
            <p>{chef.especialidade}</p>
          </div>
        </div>
        <div className="chef-info">
          <span>📍 {chef.localizacao}</span>
          <span>{chef.receitas.length} receitas</span>
        </div>
      </article>
    </Link>
  );
}
