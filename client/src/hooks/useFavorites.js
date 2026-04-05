import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('favoritos');
    setFavorites(stored ? JSON.parse(stored) : []);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const updated = prev.includes(id)
        ? prev.filter(f => f !== id)
        : [...prev, id];
      localStorage.setItem('favoritos', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (id) => favorites.includes(id);

  return { favorites, toggleFavorite, isFavorite };
}

export function useHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('historico');
    setHistory(stored ? JSON.parse(stored) : []);
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
