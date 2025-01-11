import { fetchPopularMovies } from "./API.js"


const popularMoveis = async (page)=> {
try{
    const movies = await fetchPopularMovies(page);
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = "";

    movies.results.forEach(movie => {
        const card = document.createElement('div');
        card.className = "movie-card";
        card.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title} Poster">
                <p>${movie.title}</p>
                <p> 개봉일 : ${movie.release_date}</p>
            `;
        movieList.appendChild(card);
    });
}
catch(error){ 
    throw error;
}
}
popularMoveis();

