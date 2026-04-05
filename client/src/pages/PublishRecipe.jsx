import { useState } from 'react';
import '../styles/publish-recipe.css';

export default function PublishRecipe() {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    tempo: '',
    dificuldade: 'Fácil',
    categoria: 'Almoço',
    ingredientes: '',
    preparo: '',
    dica: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Receita enviada com sucesso! (Esta é uma página de demonstração)');
  };

  return (
    <div className="publish-page">
      <div className="publish-container">
        <h1>Publicar Sua Receita</h1>
        <p>Compartilhe sua receita favorita com nossa comunidade</p>

        <form onSubmit={handleSubmit} className="publish-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome da Receita</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Bolo de Chocolate"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="tempo">Tempo de Preparo</label>
              <input
                type="text"
                id="tempo"
                name="tempo"
                value={formData.tempo}
                onChange={handleChange}
                placeholder="Ex: 30 min"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dificuldade">Dificuldade</label>
              <select
                id="dificuldade"
                name="dificuldade"
                value={formData.dificuldade}
                onChange={handleChange}
              >
                <option>Fácil</option>
                <option>Médio</option>
                <option>Difícil</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="categoria">Categoria</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
              >
                <option>Almoço</option>
                <option>Jantar</option>
                <option>Café da Manhã</option>
                <option>Lanche</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva sua receita..."
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ingredientes">Ingredientes (um por linha)</label>
            <textarea
              id="ingredientes"
              name="ingredientes"
              value={formData.ingredientes}
              onChange={handleChange}
              placeholder="2 xícaras de farinha&#10;1 ovo&#10;..."
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preparo">Modo de Preparo (um passo por linha)</label>
            <textarea
              id="preparo"
              name="preparo"
              value={formData.preparo}
              onChange={handleChange}
              placeholder="1. Misture os ingredientes&#10;2. Despeje na forma&#10;..."
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dica">Dica do Chef</label>
            <textarea
              id="dica"
              name="dica"
              value={formData.dica}
              onChange={handleChange}
              placeholder="Compartilhe uma dica especial..."
              rows={3}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Publicar Receita
          </button>
        </form>
      </div>
    </div>
  );
}
