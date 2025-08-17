
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

    img.src = (movie.Poster && movie.Poster != 'N/A') ? movie.Poster : '';
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
