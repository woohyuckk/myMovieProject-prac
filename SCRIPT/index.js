import { fetchSearchMovies } from "./API";
import { debounce } from "./debounce.util";

// makeMovieCards
function renderMovieList(movieInfos) {
    const movieCardListEl = movieInfos
        .map(
            (movieInfo, idx) =>
                `<div class="movie-card ${idx}" data-id="${movieInfo.id}">
              <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title} Poster">
              <p>${movie.title}</p>
              <p> 개봉일 : ${movie.release_date}</p>
          </div>`
        )
        .join("");
    document.getElementById("movie-list").innerHTML = movieCardListEl;
}

/* start of movie card list ui 그리기 */
// popularMoveis
async function renderPopularMovies() {
    try {
        const response = await fetchPopularMovies(window.currentPageNumber);
        window.totalPage = response.total_pages;
        drawMovieList(response.results);
    } catch (e) {
        // 속성이 이게 맞는지는 모르겠습니다.
        alert(e.status_message);
    }
}

// searchMovies
async function renderSearchMovies() {
    const keyword = document.getElementById("search-input").value.toLowerCase();
    if (keyword) renderPopularMovies();
    try {
        const response = await fetchSearchMovies(window.currentPageNumber);
        window.totalPage = response.total_pages;
        drawMovieList(response.results);
    } catch (e) {
        // 속성이 이게 맞는지는 모르겠습니다.
        alert(e.status_message);
    }
}

// bookmarkPage
async function renderBookmarkMovies() {
    const movieInfos = JSON.parse(localStorage.getItem("bookmarkMovies")) || [];
    drawMovieList(movieInfos);
}
/* end of movie card list ui 그리기 */

// searchInput.addEventListener
const handleSearchMovieWithDebounce = debounce(() => {
    window.currentPage = 1;
    renderSearchMovies();
});
document
    .getElementById("search-input")
    .addEventListener(handleSearchMovieWithDebounce);
