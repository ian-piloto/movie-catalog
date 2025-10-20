export default function MovieCard({ movie, onDetails, onToggleFavorite, isFavorite }) {
    return (
        <div className="card">
            <img src={movie.Poster} alt={movie.Title} />
            <h3>{movie.Title}</h3>
            <div className="badge">{movie.Year}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="button" onClick={() => onDetails(movie)}>Detalhes</button>
                <button className="button" onClick={() => onToggleFavorite(movie)}>
                    {isFavorite ? '★ Favorito' : '☆ Favoritar'}
                </button>
            </div>
        </div>
    );
}