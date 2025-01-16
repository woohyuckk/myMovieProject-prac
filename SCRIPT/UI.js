import { fetchPopularMovies, fetchSearchMovies } from "./API.js";

const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");
const mainPageTitle = document.querySelector(".header-title");
const modalBookmark = document.getElementById("modal-bookmark");
const bookmark = document.getElementById("bookmark");
const nextPage = document.querySelector(".next-page");
const previousPage = document.querySelector(".previous-page");
const delay = 300;

let currentPopularMovies = [];
let currentSearchMovies = [];

let bookmarkList = JSON.parse(localStorage.getItem("bookmarkMovies")) || [];
console.log(bookmarkList);
let pageStatus = "";
let currentPage = 1;
let totalPage;
let debounceTimer;

// 영화카드 생성 -> const 만쓴다.
function makeMovieCards(movies) {
    movies.forEach((movie, idx) => {
        const card = document.createElement("div");
        card.className = `movie-card ${idx}`;
        card.setAttribute("data-id", movie.id);
        //data-id에 movie id 저장
        card.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title} Poster">
            <p>${movie.title}</p>
            <p> 개봉일 : ${movie.release_date}</p>
        `;
        movieList.appendChild(card);
    });
}

// mainPage load - const, fetchPopularMovies, makeMovieCards
const popularMovies = async (page) => {
    try {
        const movies = await fetchPopularMovies(page);
        movieList.innerHTML = "";
        currentPopularMovies = movies.results;
        totalPage = movies.total_pages;
        pageStatus = "popular";

        makeMovieCards(currentPopularMovies);
    } catch (error) {
        console.error("서버와의 통신이 원활하지 않습니다.");
        return;
    }
};

// searchMovies load - const, popularMovies, fetchSearchMovies, makeMovieCards
const searchMovies = async (query, page) => {
    query = document.getElementById("search-input").value.toLowerCase();
    if (!query) {
        popularMovies();
        return;
    }
    try {
        const movies = await fetchSearchMovies(query, page);
        movieList.innerHTML = "";
        currentSearchMovies = movies.results;
        totalPage = movies.total_pages;
        pageStatus = "search"; // 검색 상태 활성화
        makeMovieCards(currentSearchMovies);
    } catch (error) {
        console.error("서버와의 통신이 원활하지 않습니다.");
        return;
    }
};

// bookmarkMovies load - const, makeMovieCards
function bookmarkPage(bookmarkdata) {
    movieList.innerHTML = "";
    makeMovieCards(bookmarkdata);
}

//  버튼 영화 검색 - const, searchMovies
searchBtn.addEventListener("click", () => {
    currentPage = 1;
    searchMovies();
});
// input형 영화검색 - const, searchMovies
searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        currentPage = 1;
        searchMovies(); // Perform search after delay
    }, delay);
});

// 현재 메인 페이지 mode 분류 (main, search, bookmark)
function statusCheck(mode, movieId) {
    switch (mode) {
        case "search":
            return currentSearchMovies.find((movie) => movie.id == movieId);

        case "popular":
            return currentPopularMovies.find((movie) => movie.id == movieId);

        case "bookmark":
            return bookmarkList.find((movie) => movie.id == movieId);

        default:
            console.log("해당하는 데이터가 없습니다.");
            break;
    }
    return movieData;
}

// modal open -const, statusCheck

movieList.addEventListener("click", function (e) {
    const movieCard = e.target.closest(".movie-card");
    const movieId = movieCard.getAttribute("data-id");
    modal.setAttribute("data-id", movieId);

    if (!movieCard) {
        e.stopPropagation();
        return;
    }
    const movieData = statusCheck(pageStatus, movieId);

    if (movieData) {
        fucntion;
        // modal 업데이트
        modal.querySelector(".modal-title").textContent = movieData.title;
        modal.querySelector(
            ".modal-card img"
        ).src = `https://image.tmdb.org/t/p/w300${movieData.poster_path}`;
        modal.querySelector(".modal-overview").textContent =
            movieData.overview || "줄거리 정보 없음";
        modal.querySelector(
            ".modal-release"
        ).textContent = `개봉날짜: ${movieData.release_date}`;
        modal.querySelector(
            ".modal-vote"
        ).textContent = `평점: ${movieData.vote_average}`;
        modal.style.display = "block";
    }
});

// modalClose - const
modalClose.addEventListener("click", () => {
    modal.style.display = "none";
});

// bookmark add - const, statusCheck, bookmarkPage
modalBookmark.addEventListener("click", (e) => {
    const modalCard = e.target.closest(".modal");
    const movieId = modalCard.getAttribute("data-id");
    const selectedMovie = statusCheck(pageStatus, movieId);
    if (selectedMovie) {
        // bookmarkMovies에 이미 존재하는지 확인
        const isAlreadyBookmarked = bookmarkList.some(
            (movie) => movie.id == selectedMovie.id
        );
        if (isAlreadyBookmarked) {
            bookmarkList = bookmarkList.filter(
                (movie) => movie.id !== selectedMovie.id
            );
            localStorage.setItem(
                "bookmarkMovies",
                JSON.stringify(bookmarkList)
            );
            alert("북마크가 해제되었습니다.");
            bookmarkPage(bookmarkList);
        } else {
            // 중복되지 않으면 추가
            bookmarkList.push(selectedMovie);
            localStorage.setItem(
                "bookmarkMovies",
                JSON.stringify(bookmarkList)
            );
            alert("북마크에 추가되었습니다:", selectedMovie);
        }
    } else {
        console.warn("영화를 찾을 수 없습니다.");
    }
});

// remoteController - to bookmark page - const, bookmarkPage
bookmark.addEventListener("click", () => {
    pageStatus = "bookmark";
    bookmarkPage(bookmarkList);
});
// remoteController - to next page - const, popularMovies, searchMovies
nextPage.addEventListener("click", () => {
    if (currentPage < totalPage) {
        currentPage++;
        if (pageStatus == "popular") popularMovies(currentPage);
        else if (pageStatus == "search") {
            searchMovies("", currentPage);
        } else if (pageStatus == "bookmark")
            alert("북마크는 이전,다음페이지가 없습니다.");
    } else return alert("마지막 페이지 입니다.");
});
// remoteController - to previous page - const, popularMovies, searchMovies
previousPage.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        if (pageStatus == "popular") popularMovies(currentPage);
        else if (pageStatus == "search") searchMovies("", currentPage);
        else if (pageStatus == "bookmark")
            alert("북마크는 이전,다음페이지가 없습니다.");
    } else return alert("첫페이지 입니다.");
});

// to main
mainPageTitle.addEventListener("click", () => {
    pageStatus = "popular"; // 검색 상태 초기화
    popularMovies();
    currentPage = 1;
});

function init() {
    popularMovies();
}
init();
