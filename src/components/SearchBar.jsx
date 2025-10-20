import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(term.trim());
  }

  return (
    <form className="topbar" onSubmit={handleSubmit}>
      <input
        placeholder="Busque por título…"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button className="button" type="submit">Buscar</button>
    </form>
  );
}