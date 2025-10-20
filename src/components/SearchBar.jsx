import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');
  const [year, setYear] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    // Envia o termo e o ano. Se 'term' for vazio e 'year' for preenchido,
    // o App.js usa a lógica da busca genérica.
    onSearch(term.trim(), year.trim());
  }

  return (
    <form className="topbar" onSubmit={handleSubmit}>
      <input
        placeholder="Busque por título…"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <input
        type="number"
        placeholder="Ano (ex: 2024)"
        value={year}
        onChange={(e) => setYear(e.target.value.slice(0, 4))} 
        style={{ width: '120px' }}
      />
      <button className="button" type="submit">Buscar</button>
    </form>
  );
}