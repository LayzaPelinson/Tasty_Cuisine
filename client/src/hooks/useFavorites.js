import React, { useState, useEffect } from 'react';
import { apiCall } from '../lib/api.ts';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userId && userType === 'usuario') {
        try {
          const response = await apiCall('/favorito/findAll');
          if (response && Array.isArray(response.data)) {
            const myFavs = response.data
              .filter(f => f.usuario && f.usuario.codUser.toString() === userId)
              .map(f => f.receita.codReceitas.toString());
            setFavorites(myFavs);
          }
        } catch (err) {
          console.error("Erro ao carregar favoritos:", err);
          setFavorites([]);
        }
      }
    };
    fetchFavorites();
  }, [userId, userType]);

  const toggleFavorite = async (id) => {
    if (!userId || userType !== 'usuario') {
      alert("Você precisa estar logado como usuário comum para favoritar.");
      return;
    }
    const isFavorite = favorites.includes(id);
    try {
      if (!isFavorite) {
        const payload = {
          usuario: { codUser: parseInt(userId) },
          receita: { codReceitas: parseInt(id) }
        };
        await apiCall('/favorito', { method: 'POST', body: JSON.stringify(payload) });
        setFavorites(prev => [...prev, id]);
      } else {
        alert("Esta receita já está nos seus favoritos.");
      }
    } catch (err) { console.error(err); }
  };

  return { favorites, toggleFavorite };
}

// GARANTINDO A EXPORTAÇÃO DO useHistory
export function useHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('historico');
      setHistory(stored ? JSON.parse(stored) : []);
    } catch (e) {
      setHistory([]);
    }
  }, []);

  const addToHistory = (id) => {
    setHistory(prev => {
      const updated = [id, ...prev.filter(h => h !== id)].slice(0, 20);
      localStorage.setItem('historico', JSON.stringify(updated));
      return updated;
    });
  };

  return { history, addToHistory };
}
