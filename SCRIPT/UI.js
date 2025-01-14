import { fetchPopularMovies, fetchSearchMovies } from "./API.js"

const movieList = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const mainPage = document.querySelector('.header-title')
const modalBookmark = document.getElementById('modal-bookmark')
const bookmark = document.getElementById('bookmark');
let currentPopularMovies = [];
let currentSearchMovies = [];
let bookmarkData = [];
let isSearchMode = false;


const popularMoveis = async (page) => {
    try {
        const movies = await fetchPopularMovies(page);
        movieList.innerHTML = "";
        currentPopularMovies = movies.results;

        currentPopularMovies.forEach((movie, idx) => {
            const card = document.createElement('div');
            card.className = `movie-card ${idx}`;
            card.setAttribute('data-id', movie.id);
            //data-id에 movie id 저장
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
        const movies = await fetchSearchMovies(query, page);
        movieList.innerHTML = "";
        currentSearchMovies = movies.results;
        isSearchMode = true; // 검색 상태 활성화


        movies.results.forEach(movie => {
            const card = document.createElement('div');
            card.className = "movie-card";
            card.setAttribute('data-id', movie.id);
            //data-id에 movie id 저장

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

// modal 

movieList.addEventListener('click', function (e) {
    // movieList에 img만 클릭되도록 방지
    if (e.target.tagName !== "IMG") {
        e.stopPropagation();
        return
    }
    const movieCard = e.target.closest('.movie-card');
    const movieId = movieCard.getAttribute('data-id');
    modal.setAttribute('data-id', movieId)
    const movieData = isSearchMode
        ? currentSearchMovies.find(movie => movie.id == movieId) // 검색 결과에서 찾기
        : currentPopularMovies.find(movie => movie.id == movieId) // 인기 영화에서 찾기
        // ? bookmarkData.find(movie => movie.id ==movieId)
        // : console.log("찾으려는 목록이 없습니다.");
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

// modalClose
modalClose.addEventListener('click', () => {
    modal.style.display = "none";
})

// bookmark

modalBookmark.addEventListener('click', (e) => {

    const modalCard = e.target.closest('.modal');
    const movieId = modalCard.getAttribute('data-id');
    const selectedMovie = isSearchMode
        ? currentSearchMovies.find(movie => movie.id == movieId) // 검색 결과에서 찾기
        : currentPopularMovies.find(movie => movie.id == movieId); // 인기 영화에서 찾기

    if (selectedMovie) {
        // bookmarkData에 이미 존재하는지 확인
        const isAlreadyBookmarked = bookmarkData.some(movie => movie.id == selectedMovie.id);
        if (isAlreadyBookmarked) {
            bookmarkData=bookmarkData.filter( movie => movie.id !== selectedMovie.id)
            alert("북마크가 해제되었습니다.")
        } else {
            // 중복되지 않으면 추가
            bookmarkData.push(selectedMovie);
            alert("북마크에 추가되었습니다:", selectedMovie);
        }
    } else {
        console.warn("영화를 찾을 수 없습니다.");
    }
})

function bookmarkList(bookmarkdata) {
    movieList.innerHTML = "";

    bookmarkdata.forEach((movie, idx) => {
        const card = document.createElement('div');
        card.className = `movie-card ${idx}`;
        card.setAttribute('data-id', movie.id);
        //data-id에 movie id 저장
        card.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title} Poster">
                <p>${movie.title}</p>
                <p> 개봉일 : ${movie.release_date}</p>
            `;
        movieList.appendChild(card);
    });

}


bookmark.addEventListener('click',()=>{
    console.log(bookmarkData)
    bookmarkList(bookmarkData);
})


// to main
mainPage.addEventListener('click', () => {
    isSearchMode = false; // 검색 상태 초기화
    popularMoveis();
})