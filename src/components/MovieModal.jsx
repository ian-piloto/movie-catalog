export default function MovieModal({ movie, onClose }) {
    if (!movie) return null;
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>{movie.Title} ({movie.Year})</h2>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <img src={movie.Poster} alt={movie.Title} style={{ width: 180, borderRadius: 8 }} />
                    <div>
                        <p><strong>Tipo:</strong> {movie.Type || 'N/A'}</p>
                        <p><strong>Sinopse:</strong> {movie.Plot || 'Sem sinopse.'}</p>
                        <p><strong>Diretor:</strong> {movie.Director || '—'}</p>
                        <p><strong>Elenco:</strong> {movie.Actors || '—'}</p>
                    </div>
                </div>
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <button className="button" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
}
