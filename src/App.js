import React, { useState, useCallback, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';

const API = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_KEY}`;

const getFavorites = () => {
  const f = localStorage.getItem('movieFavorites');
  return f ? JSON.parse(f) : {};
};

export default function App() {
  const [movies, setMovies] = useState([]);
  const [term, setTerm] = useState('');
  const [modalMovie, setModalMovie] = useState(null);
  const [favorites, setFavorites] = useState(getFavorites());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('search');
  const [initialLoad, setInitialLoad] = useState(true);

  // A função searchMovies agora aceita o parâmetro y (ano)
  async function searchMovies(t, y) {
    if (!process.env.REACT_APP_OMDB_KEY) {
        setError('Erro: A chave da API não está carregada. Verifique o .env.');
        return;
    }

    // NOVA LÓGICA: Se não houver termo (t) e nem ano (y), limpa a lista e sai.
    if (!t && !y) {
        setMovies([]);
        return;
    }

    try {
      setLoading(true);
      setError('');
      setTerm(t);
      
      // Se o termo (t) estiver vazio, usa um termo genérico ('movie') para que a busca por ano funcione.
      const searchKeyword = t || 'movie'; 
      
      // LÓGICA DO FILTRO DE ANO: Constrói a query do ano
      const yearQuery = y ? `&y=${y}` : ''; 
      
      // Monta a URL da busca usando searchKeyword
      const searchUrl = `${API}&s=${encodeURIComponent(searchKeyword)}&type=movie${yearQuery}`;

      // 1. Busca inicial
      const res = await fetch(searchUrl);
      const data = await res.json();

      if (data.Response === 'False') {
        setMovies([]);
        // Exibe o erro específico da OMDb ou um genérico
        setError(data.Error || 'Nenhum resultado encontrado.');
        return;
      }

      // 2. Busca detalhes para Plot/Director/Actors
      const detailed = await Promise.all(
        data.Search.slice(0, 12).map(async (m) => {
          const r = await fetch(`${API}&i=${m.imdbID}&plot=short`);
          return r.json();
        })
      );
      
      setMovies(detailed);

    } catch (e) {
      console.error(e);
      setError('Erro ao buscar filmes.');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }

  // handleSearch agora aceita o parâmetro y e o repassa
  const handleSearch = useCallback((t, y = '') => { 
    setView('search');
    searchMovies(t, y);
  }, []);

  const handleToggleFavorite = (movie) => {
    const imdbID = movie.imdbID;
    const newFavorites = { ...favorites };
    
    if (newFavorites[imdbID]) {
      delete newFavorites[imdbID];
    } else {
      newFavorites[imdbID] = movie;
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
  };

  const handleOpenModal = (movie) => setModalMovie(movie);
  const handleCloseModal = () => setModalMovie(null);

  useEffect(() => {
    // Busca inicial por 'Action', SEM filtro de ano ('')
    searchMovies('Action', ''); 
  }, []);

  const isSearchMode = view === 'search';
  const displayedMovies = isSearchMode ? movies : Object.values(favorites);

  return (
    <div className="container">
      <h1>Catálogo de Filmes</h1>

      <div className="topbar" style={{ marginBottom: '16px' }}>
        <button 
          className="button favs" 
          onClick={() => setView(isSearchMode ? 'favorites' : 'search')}
        >
          {isSearchMode ? '★ Ver Meus Favoritos' : 'Voltar para a Busca'}
        </button>
      </div>

      {isSearchMode && <SearchBar onSearch={handleSearch} />}

      {isSearchMode && loading && <p>Carregando…</p>}
      {isSearchMode && !loading && error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      
      {isSearchMode && !loading && !error && movies.length === 0 && (
        <p>
          {/* Ajustado o feedback: se a busca for por 'movie' (apenas ano) ou vazia */}
          {term === 'Action' && initialLoad
            ? 'Carregando recomendações...'
            : 'Nenhum resultado encontrado. Digite um título e/ou ano para buscar.'}
        </p>
      )}

      {!isSearchMode && displayedMovies.length === 0 && (
        <p>Você não tem filmes favoritos marcados.</p>
      )}

      <div className="grid">
        {displayedMovies.map(movie => (
          <MovieCard 
            key={movie.imdbID} 
            movie={movie} 
            onDetails={handleOpenModal} 
            onToggleFavorite={handleToggleFavorite} 
            isFavorite={!!favorites[movie.imdbID]} 
          />
        ))}
      </div>

      <MovieModal movie={modalMovie} onClose={handleCloseModal} />
      
    </div>
  );
}