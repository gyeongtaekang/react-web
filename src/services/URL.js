import axios from 'axios';

class URLService {
  constructor() {
    this.apiKey = process.env.REACT_APP_TMDB_API_KEY;
    this.baseURL = 'https://api.themoviedb.org/3';
    this.language = 'ko-KR';
    this.headers = {
      'Content-Type': 'application/json',
    };
    this.imageBaseURL = 'https://image.tmdb.org/t/p/';
    this.posterSize = 'w300';
    this.backdropSize = 'w780';
  }

  getPosterUrl(path) {
    return path ? `${this.imageBaseURL}${this.posterSize}${path}` : '/placeholder-image.jpg';
  }

  getBackdropUrl(path) {
    return path ? `${this.imageBaseURL}${this.backdropSize}${path}` : '';
  }

  getURL4PopularMovies(page = 1) {
    return `${this.baseURL}/movie/popular?api_key=${this.apiKey}&language=${this.language}&page=${page}&include_adult=false`;
  }

  getURL4ReleaseMovies(page = 2) {
    return `${this.baseURL}/movie/now_playing?api_key=${this.apiKey}&language=${this.language}&page=${page}&include_adult=false`;
  }

  getURL4GenreMovies(genre, page = 1) {
    return `${this.baseURL}/discover/movie?api_key=${this.apiKey}&with_genres=${genre}&language=${this.language}&page=${page}&include_adult=false`;
  }

  async fetchPopularMovies(page = 1) {
    const response = await axios.get(`${this.baseURL}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        page,
        include_adult: false, // 성인 콘텐츠 제외
      },
      headers: this.headers,
    });
    return response.data.results;
  }

  async fetchNowPlayingMovies(page = 1) {
    const response = await axios.get(`${this.baseURL}/movie/now_playing`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        page,
        include_adult: false, // 성인 콘텐츠 제외
      },
      headers: this.headers,
    });
    return response.data.results;
  }

  async fetchMoviesByGenre(genreId, page = 1) {
    const response = await axios.get(`${this.baseURL}/discover/movie`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        with_genres: genreId,
        page,
        include_adult: false, // 성인 콘텐츠 제외
      },
      headers: this.headers,
    });
    return response.data.results;
  }

  async fetchGenres() {
    const response = await axios.get(`${this.baseURL}/genre/movie/list`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
      },
      headers: this.headers,
    });
    return response.data.genres;
  }
}

export default URLService;
