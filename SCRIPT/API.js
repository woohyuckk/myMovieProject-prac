export const key = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzYzODM3NTM0ZTA1MjgxMTUzZTY3N2M4ODJmNjQ3OSIsIm5iZiI6MTczNjI5NTY2OS44MDA5OTk5LCJzdWIiOiI2NzdkYzRmNTIxOGZkNTdhY2Y0ZTRlNzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.hph74eopL8GQ7etWGx2M4uQuxX06aj36B-NgJQxN2dE'

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: key
    }
}



// 친절하게 error code를 확인할 수 있는 링크 까지 던져 줌
const fetchPopularMovies = async (page = 1) => {
    const url = `https://api.themoviedb.org/3/movie/popular?language=ko-KR&${page}&region=KR`;
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} to learn more about error codes, visit the following link : https://developer.themoviedb.org/docs/errors `)
        }
        const dataPopular = await response.json();
        console.log(dataPopular);
        return dataPopular;
    }
    catch (error) {
        throw error;

    }

}
fetchPopularMovies();


const fetchSearchMovies = async (query, page = 1) =>{

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=ko-KR&${page}&region=KR `
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} to learn more about error codes, visit the following link : https://developer.themoviedb.org/docs/errors `)
        }
        const dataSearch = await response.json();
        console.log(dataSearch);
        return dataSearch; 

    }
    catch(error) {
        throw error;
        
    }
}


export { fetchPopularMovies, fetchSearchMovies };