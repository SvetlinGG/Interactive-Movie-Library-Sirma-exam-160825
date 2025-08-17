
import { searchMovies, getMovieById } from "./api.js";

const el = {
    form: document.getElementById('searchForm'),
    q: document.getElementById('q'),
    resultsGrid: document.getElementById('resultsGrid'),
    pager: document.getElementById('pager'),
    prev: document.getElementById('prevBtn'),
    next: document.getElementById('nextBtn'),
    pageInfo: document.getElementById('pageInfo'),
    showResultsBtn: document.getElementById('showResultsBtn'),
    showFavsBtn: document.getElementById('showFavsBtn'),
    favoritesView: document.getElementById('favoritesView'),
    favList: document.getElementById('favList'),
    clearFavBtn: document.getElementById('clearFavBtn'),
    helpBtn: document.getElementById('helpBtn'),
    cardTpl: document.getElementById('cardTpl'),
    modal: document.getElementById('modal'),
    modalContent: document.getElementById('modalContent'),
};

const state = {
    q: '',
    page: 1,
    total: 0,
    mode: 'result',
    favs: loadFavs(),
}
function loadFavs(){
    try {
        return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch{
        return [];
    }
}
function saveFavs(){
    localStorage.setItem('favorites', JSON.stringify(state.favs));
}

function isFav(id){
    return state.favs.some(f => f.imdbID === id)
}
function addFav(movie){
    if(!isFav(movie.imdbID)){
        state.favs.push({
            imdbID: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            poster: movie.Poster,
            type: movie.Type,
        });
        saveFavs();
    }
}
function removeFav(id){
    state.favs = state.favs.filter(f => f.imdbID != id);
    saveFavs();
}

function setLoading(){
    el.resultsGrid.innerHTML = '<p>Loading...</p>';
    el.pager.hidden = true;
}

function updatePager(){
    const frag = el.cardTpl.content.cloneNode(true);
    const card = frag.querySelector('.card');
    const img = frag.querySelector('.poster');
    const title = frag.querySelector('.title');
    const sub = frag.querySelector('.sub');
    const btnDetails = frag.querySelector('.details');
    const btnFav = frag.querySelector('.fav');

    img.src = (movie.Poster && movie.Poster !== 'N/A') ? movie.Poster : '';
    img.alt = movie.Title || 'Poster';
    title.textContent = movie.Title;
    sub.textContent = `${movie.Year} • ${movie.Type}`;

    const syncFavButton = () => {
        const fav = isFav(movie.imdbID);
        btnFav.setAttribute('aria-pressed', String(fav));
        btnFav.textContent = fav ? '★' : '☆';
        btnFav.title = fav ? 'Remove from favorites' : 'Add to favorites';
    };
    syncFavButton();

    btnFav.addEventListener('click', () => {
        if (isFav(movie.imdbID))  removeFav(movie.imdbID);
        else addFav(movie);
        syncFavButton();
        if (state.mode === 'favs') renderFavorites();
    });

    btnDetails.addEventListener('click', () => openDetails(movie.imdbID));

    card.tabIndex = 0;
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') openDetails(movie.imdbID);
    });
    return frag;
}

async function doSearch(){
    if ( !state.q.trim()) {
        el.resultsGrid.innerHTML = '<p>Enter a movie title to search.</p>';
        el.pager.hidden = true;
        return;
    }
    setLoading();
    try {
        const data = await searchMovies({q: state.q, page: state.page});
        state.total = Number(data.totalResult || 0);
        const list = data.Search || [];
        el.resultsGrid.innerHTML = '';
        list.forEach(m => el.resultsGrid.appendChild(cardFrom(m)));
        updatePager();
    } catch (err) {
        el.resultsGrid.innerHTML = `<p role="alert">Error: ${err.message}</p>`;
        el.pager.hidden = true;
    }
}
async function openDetails(id){
    el.modalContent.innerHTML = 'Loading...';
    if (!el.modal.open) el.modal.showModal();
    try {
        const m = await getMovieById(id);
        const poster = (m.Poster && m.Poster !== 'N/A') ? `<img src="${m.Poster}" alt="${m.Title}" style="max-width:160px;height:auto;float:right;margin-left:12px;border-radius:10px">` : '';
        el.modalContent.innerHTML = `
            ${poster}
            <h3>${m.Title} (${m.Year})</h3>
            <p><strong>Genre:</strong> ${m.Genre || '—'}</p>
            <p><strong>Actors:</strong> ${m.Actors || '—'}</p>
            <p><strong>IMDB:</strong> ${m.imdbRating || '—'}</p>
            <p><strong>Plot:</strong> ${m.Plot || '—'}</p>
            <div style="clear:both"></div>
            `;

    } catch (e) {
        el.modalContent.innerHTML = `<p role="alert">Error: ${e.message}</p>`
    }
}



function renderFavorites(){
    el.favList.innerHTML = '';
    if (state.favs.length === 0) {
      el.favList.innerHTML = '<li>No favorites yet.</li>';
      return;
    }
    for (const f of state.favs) {
      const li = document.createElement('li');
      li.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px">
          <img src="${(f.poster && f.poster !== 'N/A') ? f.poster : ''}" alt="${f.title}" style="width:48px;height:64px;object-fit:cover;border-radius:6px;background:#0b0d10">
          <div style="flex:1">
            <div><strong>${f.title}</strong></div>
            <div style="color:#93a1b3;font-size:13px">${f.year} • ${f.type}</div>
          </div>
          <button data-id="${f.imdbID}" class="open">Details</button>
          <button data-id="${f.imdbID}" class="remove">Remove</button>
        </div>
      `;
      el.favList.appendChild(li);
    }
    el.favList.querySelectorAll('.open').forEach(b => b.addEventListener('click', e => openDetails(e.currentTarget.dataset.id)));
    el.favList.querySelectorAll('.remove').forEach(b => b.addEventListener('click', e => {
      removeFav(e.currentTarget.dataset.id);
      renderFavorites();
    }));
  }
  
  function showResultsMode(){
    state.mode = 'results';
    el.favoritesView.hidden = true;
    el.resultsGrid.hidden = false;
    el.pager.hidden = false;
    doSearch();
  }
  
  function showFavsMode(){
    state.mode = 'favs';
    el.resultsGrid.hidden = true;
    el.pager.hidden = true;
    el.favoritesView.hidden = false;
    renderFavorites();
  }
  
  // Събития
  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.q = el.q.value.trim();
    state.page = 1;
    showResultsMode();
  });
  el.prev.addEventListener('click', () => { state.page--; doSearch(); });
  el.next.addEventListener('click', () => { state.page++; doSearch(); });
  el.showResultsBtn.addEventListener('click', showResultsMode);
  el.showFavsBtn.addEventListener('click', showFavsMode);
  el.clearFavsBtn.addEventListener('click', () => { state.favs = []; saveFavs(); renderFavorites(); });
  
  el.helpBtn.addEventListener('click', () => {
    el.modalContent.innerHTML = `
      <h3>How to use</h3>
      <ol>
        <li>Type a movie name and press <em>Search</em>.</li>
        <li>Open <em>Details</em> on any card.</li>
        <li>Use the ☆ to add/remove favorites; view them in <em>Favorites</em>.</li>
      </ol>
    `;
    if (!el.modal.open) el.modal.showModal();
  });
  
  // При първо отваряне – показваме помощ или последно търсене
  state.q = '';
  el.q.value = '';
  showResultsMode();
