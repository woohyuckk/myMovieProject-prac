import { fetchPopularMovies, fetchSearchMovies } from "./API.js"

const movieList = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const mainPage = document.querySelector('.header-title')
const modalBookmark = document.getElementById('modal-bookmark')
const bookmark = document.getElementById('bookmark');
const nextPage = document.querySelector('.next-page');
const previousPage = document.querySelector('.previous-page');
let currentPopularMovies = [];
let currentSearchMovies = [];
let bookmarkMovies = [];
let pageStatus = "";
let currentPage = 1;
let debounceTimer;


const popularMoveis = async (page) => {
    try {
        const movies = await fetchPopularMovies(page);
        movieList.innerHTML = "";
        currentPopularMovies = movies.results;
        pageStatus = "popular";
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
        pageStatus = "search"; // 검색 상태 활성화


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

searchInput.addEventListener('input', (event) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchMovies(); // Perform search after delay
    }, 300);
});

// 현재 열어 놓은 페이지 mode 분류 
function statusCheck(mode, movieId) {
    switch (mode) {
        case "search":
            return currentSearchMovies.find(movie => movie.id == movieId)
            break
        case "popular":
            return currentPopularMovies.find(movie => movie.id == movieId)
            break
        case "bookmark":
            return bookmarkMovies.find(movie => movie.id == movieId)
            break
        default: console.log("해당하는 데이터가 없습니다.")
            break;
    }
    return movieData;
}

// modal open
movieList.addEventListener('click', function (e) {
    // movieList에 img만 클릭되도록 방지
    if (e.target.tagName !== "IMG") {
        e.stopPropagation();
        return
    }
    const movieCard = e.target.closest('.movie-card');
    const movieId = movieCard.getAttribute('data-id');
    modal.setAttribute('data-id', movieId);

    const movieData = statusCheck(pageStatus, movieId);
    // const movieData = isSearchMode
    //     ? currentSearchMovies.find(movie => movie.id == movieId) // 검색 결과에서 찾기
    //     : currentPopularMovies.find(movie => movie.id == movieId) // 인기 영화에서 찾기
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

// bookmark add

modalBookmark.addEventListener('click', (e) => {

    const modalCard = e.target.closest('.modal');
    const movieId = modalCard.getAttribute('data-id');
    const selectedMovie = statusCheck(pageStatus, movieId)
    if (selectedMovie) {
        // bookmarkMovies에 이미 존재하는지 확인
        const isAlreadyBookmarked = bookmarkMovies.some(movie => movie.id == selectedMovie.id);
        if (isAlreadyBookmarked) {
            bookmarkMovies = bookmarkMovies.filter(movie => movie.id !== selectedMovie.id)
            alert("북마크가 해제되었습니다.")
        } else {
            // 중복되지 않으면 추가
            bookmarkMovies.push(selectedMovie);
            alert("북마크에 추가되었습니다:", selectedMovie);
        }
    } else {
        console.warn("영화를 찾을 수 없습니다.");
    }
})

// bookmark load
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

// remoteController - to bookmarkpage
bookmark.addEventListener('click', () => {
    pageStatus = "bookmark"
    bookmarkList(bookmarkMovies);
})

// remoteController - to nextpage
nextPage.addEventListener('click', () => {
    currentPage++;
    if (pageStatus == "popular") popularMoveis(currentPage);
    else if (pageStatus == "search") searchMovies("", currentPage)
    else if (pageStatus == "bookmark") alert("북마크는 이전,다음페이지가 없습니다.")
})
previousPage.addEventListener('click', () => {
    if (currentPage) {
        currentPage--;
        console.log(currentPage);
        if (pageStatus == "popular") popularMoveis(currentPage);
        else if (pageStatus == "search") searchMovies("", currentPage)
        else if (pageStatus == "bookmark") alert("북마크는 이전,다음페이지가 없습니다.")
    }
    else return
})

// to main
mainPage.addEventListener('click', () => {
    pageStatus = "popular" // 검색 상태 초기화
    popularMoveis();
})

