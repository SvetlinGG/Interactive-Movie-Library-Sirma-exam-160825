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