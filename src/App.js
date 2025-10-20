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

  async function searchMovies(t) {
    if (!process.env.REACT_APP_OMDB_KEY) {
      setError('Erro: A chave da API não está carregada. Verifique o .env.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setTerm(t);

      if (!t) return setMovies([]);

      const res = await fetch(`${API}&s=${encodeURIComponent(t)}&type=movie`);
      const data = await res.json();

      if (data.Response === 'False') {
        setMovies([]);
        setError(data.Error || 'Nenhum resultado.');
        return;
      }

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

  const handleSearch = useCallback((t) => {
    setView('search');
    searchMovies(t);
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
    searchMovies('horror');
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
          {term === 'Action' && initialLoad
            ? 'Carregando recomendações...'
            : 'Nenhum resultado encontrado. Digite um título para buscar.'}
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