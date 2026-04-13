import { useState } from 'react';
import { useLocation } from 'wouter';
import { receitasAPI, chefesAPI } from '../lib/api.ts';
import '../styles/publish-recipe.css';

export default function PublishRecipe() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    nomeReceita: '',
    descricao: '',
    manual2: '',
    imagem: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userId = localStorage.getItem('userId');
      
      // Buscar os dados do chefe
      const chefResponse = await chefesAPI.getById(userId);
      
      if (!chefResponse.data) {
        setError('Erro ao carregar dados do chef');
        setLoading(false);
        return;
      }

      const payload = {
        nomeReceita: formData.nomeReceita,
        descricao: formData.descricao,
        manual2: formData.manual2,
        imagem: formData.imagem,
        chefe: chefResponse.data // ← Envia o objeto completo do chefe
      };

      const response = await receitasAPI.create(payload);

      if (response.data) {
        setSuccess(true);
        alert('✅ Receita publicada com sucesso!');
        setFormData({
          nomeReceita: '',
          descricao: '',
          manual2: '',
          imagem: ''
        });
        setTimeout(() => setLocation('/receitas'), 2000);
      } else {
        setError(response.error || 'Erro ao publicar receita');
      }
    } catch (err) {
      setError('Erro ao publicar receita: ' + (err instanceof Error ? err.message : 'Desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publish-page">
      <div className="publish-container">
        <h1>Publicar Sua Receita</h1>
        <p>Compartilhe sua receita favorita com nossa comunidade</p>

        {error && <div className="error-message" style={{color: '#d32f2f', padding: '10px', marginBottom: '20px', backgroundColor: '#ffebee', borderRadius: '8px'}}>{error}</div>}
        {success && <div className="success-message" style={{color: '#388e3c', padding: '10px', marginBottom: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px'}}>✅ Receita publicada com sucesso!</div>}

        <form onSubmit={handleSubmit} className="publish-form">
          <div className="form-group">
            <label htmlFor="nomeReceita">Nome da Receita *</label>
            <input
              type="text"
              id="nomeReceita"
              name="nomeReceita"
              value={formData.nomeReceita}
              onChange={handleChange}
              placeholder="Ex: Bolo de Chocolate"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição *</label>
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
            <label htmlFor="manual2">Modo de Preparo (um passo por linha) *</label>
            <textarea
              id="manual2"
              name="manual2"
              value={formData.manual2}
              onChange={handleChange}
              placeholder="1. Misture os ingredientes&#10;2. Despeje na forma&#10;..."
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="imagem">URL da Imagem *</label>
            <input
              type="url"
              id="imagem"
              name="imagem"
              value={formData.imagem}
              onChange={handleChange}
              placeholder="Ex: https://example.com/imagem.jpg"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar Receita'}
          </button>
        </form>
      </div>
    </div>
  );
}