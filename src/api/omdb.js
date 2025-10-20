const apiKey = import.meta.env.REACT_APP_OMDB_KEY;

export async function buscarFilme(titulo) {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(titulo)}&apikey=${apiKey}`;
    const resposta = await fetch(url);
    const dados = await resposta.json();
    return dados;
}