import { fetchPopularMovies, fetchSearchMovies } from "./API.js"

const movieList = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const mainPage = document.querySelector('.header-title')
let currentPopularMovies = [];
let currentSearchMovies = [];
let isSearchMode = false;


const popularMoveis = async (page) => {
    try {
        const movies = await fetchPopularMovies(page);
        movieList.innerHTML = "";
        currentPopularMovies = movies.results;

        movies.results.forEach((movie, idx) => {
            const card = document.createElement('div');
            card.className = `movie-card ${idx}`;
            card.setAttribute('data-id', movie.id);
            card.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title} Poster">
                <p>${movie.title}</p>
                <p> 개봉일 : ${movie.release_date}</p>
            `;
            movieList.appendChild(card);
        });
    }
    catch (error) {
        throw error;
    }
}
popularMoveis();

const searchMovies = async (query, page) => {

    query = document.getElementById('search-input').value.toLowerCase();
    if (!query) {
        alert('검색어를 입력력해 주세요')
        return
    }
    try {
        movieList.innerHTML = "";
        const movies = await fetchSearchMovies(query, page);
        currentSearchMovies = movies.results;
        isSearchMode = true; // 검색 상태 활성화


        movies.results.forEach(movie => {
            const card = document.createElement('div');
            card.className = "movie-card";
            card.setAttribute('data-id', movie.id);
            card.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title} Poster">
                <p>${movie.title}</p>
                <p> 개봉일 : ${movie.release_date}</p>
            `;
            movieList.appendChild(card);
        });

    }
    catch (error) {
        throw error;
    }
}



searchBtn.addEventListener('click', () => {
    searchMovies();
})

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        searchMovies();
    }
});


movieList.addEventListener('click', function (e) {
    // movieList에 img만 클릭되도록 방지
    if (e.target.tagName !== "IMG") {
        e.stopPropagation();
        return
    }
    const movieCard = e.target.closest('.movie-card');
    const movieId = movieCard.getAttribute('data-id');
    const movieData = isSearchMode
        ? currentSearchMovies.find(movie => movie.id == movieId) // 검색 결과에서 찾기
        : currentPopularMovies.find(movie => movie.id == movieId); // 인기 영화에서 찾기

    // currentSearchMovies에서 data-id와 movie.id값이 같은 array 요소를 저장

    if (movieData) {
        // modal 업데이트
        modal.querySelector('.modal-title').textContent = movieData.title;
        modal.querySelector('.modal-card img').src = `https://image.tmdb.org/t/p/w300${movieData.poster_path}`;
        modal.querySelector('.modal-overview').textContent = movieData.overview || "줄거리 정보 없음";
        modal.querySelector('.modal-release').textContent = `개봉날짜: ${movieData.release_date}`;
        modal.querySelector('.modal-vote').textContent = `평점: ${movieData.vote_average}`;
        modal.style.display = "block";
    }


})
modalClose.addEventListener('click', () => {
    modal.style.display = "none";
})

mainPage.addEventListener('click', () => {
    isSearchMode = false; // 검색 상태 초기화
    currentSearchMovies = []; // 검색 데이터 초기화
    popularMoveis();
})