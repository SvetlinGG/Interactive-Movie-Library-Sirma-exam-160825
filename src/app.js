const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'YOUR_OMDB_KEY'; // вземи безплатен ключ от omdbapi.com и го постави тук

async function fetchJSON(params){
  const qs = new URLSearchParams({ apikey: API_KEY, ...params });
  const res = await fetch(`${API_URL}?${qs.toString()}`);
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if(data.Response === 'False') throw new Error(data.Error || 'Unknown API error');
  return data;
}

export async function searchMovies({ q, page=1 }){
  return fetchJSON({ s: q, page });
}

export async function getMovieById(id){
  return fetchJSON({ i: id, plot: 'full' });
}
