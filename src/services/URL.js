// src/services/URLService.js
import axios from 'axios';

class URLService {
  constructor() {
    this.apiKey = '01bede4653551df3f6f5e17074771100'; // 환경 변수 대신 직접 API 키 사용
    this.baseURL = 'https://api.themoviedb.org/3';
    this.language = 'ko-KR';
    this.headers = {
      'Content-Type': 'application/json',
    };
    this.imageBaseURL = 'https://image.tmdb.org/t/p/';
    this.posterSize = 'w300'; // 필요에 따라 변경 가능
    this.backdropSize = 'w780'; // 필요에 따라 변경 가능
  }

  // 이미지 URL 생성 메서드
  getPosterUrl(path) {
    return path ? `${this.imageBaseURL}${this.posterSize}${path}` : '/placeholder-image.jpg';
  }

  getBackdropUrl(path) {
    return path ? `${this.imageBaseURL}${this.backdropSize}${path}` : '';
  }

  // 인기 영화 목록 조회 URL 생성 메서드
  getURL4PopularMovies(page = 1) {
    return `${this.baseURL}/movie/popular?api_key=${this.apiKey}&language=${this.language}&page=${page}`;
  }

  getURL4ReleaseMovies(page = 2) {
    return `${this.baseURL}/movie/now_playing?api_key=${this.apiKey}&language=${this.language}&page=${page}`;
  }

  getURL4GenreMovies(genre, page = 1) {
    return `${this.baseURL}/discover/movie?api_key=${this.apiKey}&with_genres=${genre}&language=${this.language}&page=${page}`;
  }

  // 인기 영화 목록 조회 함수
  async fetchPopularMovies(page = 1) {
    const response = await axios.get(`${this.baseURL}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        page,
      },
      headers: this.headers,
    });
    return response.data.results;
  }

  // 현재 상영 중인 영화 목록 조회 함수
  async fetchNowPlayingMovies(page = 1) {
    const response = await axios.get(`${this.baseURL}/movie/now_playing`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        page,
      },
      headers: this.headers,
    });
    return response.data.results;
  }

  // 영화 상세 정보 조회 함수
  async fetchMovieDetails(movieId) {
    const response = await axios.get(`${this.baseURL}/movie/${movieId}`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
      },
      headers: this.headers,
    });
    return response.data;
  }

  // 영화 검색 기능 함수
  async searchMovies(query, page = 1) {
    const response = await axios.get(`${this.baseURL}/search/movie`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        query,
        page,
        include_adult: false, // 성인 콘텐츠 제외
      },
      headers: this.headers,
    });
    return response.data.results;
  }

  // 장르별 영화 필터링 함수
  async fetchMoviesByGenre(genreId, page = 1) {
    const response = await axios.get(`${this.baseURL}/discover/movie`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        with_genres: genreId,
        page,
      },
      headers: this.headers,
    });
    return response.data.results;
  }

  // 장르 목록 조회 함수
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

  // 액션 영화 목록 조회 함수
  async fetchActionMovies(page = 1) {
    const response = await axios.get(`${this.baseURL}/discover/movie`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        with_genres: 28, // 액션 장르 ID
        page,
      },
      headers: this.headers,
    });
    return response.data.results;
  }
}

// URLService 클래스를 직접 내보내기
export default URLService;
