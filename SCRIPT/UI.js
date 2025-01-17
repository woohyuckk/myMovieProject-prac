import { fetchPopularMovies, fetchSearchMovies } from "./API.js";
import { debounce } from "./debounce.util.js";

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


/* 현재 currentPopularMovies 와 currentSearchMovies, bookmarkList를 나누셨는데,
    이를 나눈 이유가 각 page 상태별 다른 곳에서 추출하려고 한 것 같습니다.
    하지만 한 페이지에 결국 하나의 list만 사용됨으로 이를 하나로 currentMovieList로 줄일 수 있을 것 같습니다.

    그래서 1개의 리스트로 줄이는 것을 추천하지만, 이 또한 modal을 띄워주기 위해서만 사용되는 것 같습니다.
    
    그렇다면 movie-id를 이용하여 새로 영화 상세 내용을 불러오는 방법을 추천합니다!

    리스트의 메모리 낭비가 걱정되고 또한 모달을 띄우기 위해 매번 find함수를 사용하는게 좋지 않아보입니다.
    사실 한 페이지당 그려지는 아이템이 20개 이므로 그리 의미는 없긴 합니다!

    그래서 api를 불러오는 것이 힘들다고 한다면 1개의 리스트로 줄이는 것을 추천드립니다!
*/
let currentPopularMovies = [];
let currentSearchMovies = [];
let bookmarkList = JSON.parse(localStorage.getItem("bookmarkMovies")) || [];
let pageStatus = "";
let currentPage = 1;
let totalPage;


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

// mainPage load - 메인페이지를 로드 const, fetchPopularMovies, makeMovieCards
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

// searchMovies load - 검색페이지 화면을 로드  const, popularMovies, fetchSearchMovies, makeMovieCards
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

const debouncedSearch = debounce(()=>{
    currentPage = 1;
    searchMovies(); 
});
// 영화검색 - const, searchMovies
searchInput.addEventListener("input", debouncedSearch);


/* 위에서 설명했듯이 각 무비 정보를 1개로 불러온다면 이 함수에 조건문이 필요없어질 것 같습니다.
*/

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
            alert("해당하는 데이터가 없습니다.");
            break;
    }
    return movieData;
}

// modal open -const, statusCheck

movieList.addEventListener("click", function (e) {
    const movieCard = e.target.closest(".movie-card");
    if (!movieCard) {
        return;
    }
    /* movieCard가 없는 경우 undefined에서 getAttribute를 하는 것이라 에러가 날 것 같습니다.
    따라서 if 문의 !movieCard를 여기로 옮겨서 movieCard가 없을 경우 바로 return 하도록 코드를 작성하는 것이 좋을 것 같습니다. */
    const movieId = movieCard.getAttribute("data-id");
    /* 여기서는 전역에 modal을 선언하여 가져오는 것이 아닌 이 영역에서 참조해서 사용하는 것이 좋을 것 같습니다. */
    modal.setAttribute("data-id", movieId);
    const movieData = statusCheck(pageStatus, movieId);

    /* 여기서는 element를 하나씩 참조하는 것보다 템플릿 리터럴로 html 구문을 작성한다음 innerHTML에 넣어주면 코드 가독성이 좋을 것 같아요 */
    if (movieData) {
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
/* 이쪽에서 코드 분리할 수 있는게 많을 것 같습니다. 한번 생각해보시면 좋을 것 같아요! */
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
        // 중복되지 않으면 추가
        bookmarkMovies.push(selectedMovie);
        alert("북마크에 추가되었습니다:", selectedMovie);
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

// to main - Title누를시 메인 화면으로 이동 
mainPageTitle.addEventListener("click", () => {
    pageStatus = "popular"; // 검색 상태 초기화
    popularMovies();
    currentPage = 1;
});

function init() {
    popularMovies();
}
init();
