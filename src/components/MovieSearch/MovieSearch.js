// src/components/MovieSearch/MovieSearch.js
import React, { useState, useEffect } from 'react';
import './MovieSearch.css';

function MovieSearch({ changeOptions }) {
  const API_KEY = '01bede4653551df3f6f5e17074771100';
  const BASE_URL = `https://api.themoviedb.org/3/discover/movie`;

  const dropdowns = {
    originalLanguage: ['장르 (전체)', 'Action', 'Adventure', 'Comedy', 'Crime', 'Family'],
    translationLanguage: ['평점 (전체)', '9~10', '8~9', '7~8', '6~7', '5~6', '4~5', '4점 이하'],
    sorting: ['언어 (전체)', '영어', '한국어'],
  };

  const DEFAULT_OPTIONS = {
    originalLanguage: '장르 (전체)',
    translationLanguage: '평점 (전체)',
    sorting: '언어 (전체)',
  };

  const [selectedOptions, setSelectedOptions] = useState({ ...DEFAULT_OPTIONS });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dropdownEntries = Object.entries(dropdowns).map(([key, options]) => ({
    key,
    options,
  }));

  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const selectOption = (key, option) => {
    const newOptions = {
      ...selectedOptions,
      [key]: option,
    };
    setSelectedOptions(newOptions);
    setActiveDropdown(null);
    changeOptions(newOptions);
  };

  const clearOptions = () => {
    setSelectedOptions({ ...DEFAULT_OPTIONS });
    setSearchQuery('');
    changeOptions(DEFAULT_OPTIONS);
  };

  const handleSearch = () => {
    if (searchQuery && !searchHistory.includes(searchQuery)) {
      setSearchHistory((prevHistory) => [...prevHistory, searchQuery]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchHistoryClick = (query) => {
    setSearchQuery(query);
  };

  const removeHistoryItem = (query) => {
    setSearchHistory(searchHistory.filter((item) => item !== query));
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      const genreMap = {
        'Action': 28,
        'Adventure': 12,
        'Comedy': 35,
        'Crime': 80,
        'Family': 10751,
      };

      const buildApiUrl = () => {
        let url = `${BASE_URL}?api_key=${API_KEY}&include_adult=false&language=ko`;

        if (selectedOptions.originalLanguage !== '장르 (전체)') {
          const genreId = genreMap[selectedOptions.originalLanguage];
          if (genreId) {
            url += `&with_genres=${genreId}`;
          }
        }

        if (selectedOptions.translationLanguage !== '평점 (전체)') {
          const [min, max] = selectedOptions.translationLanguage.split('~').map(Number);
          url += `&vote_average.gte=${min}&vote_average.lte=${max}`;
        }

        if (selectedOptions.sorting !== '언어 (전체)') {
          const languageMap = { '영어': 'en', '한국어': 'ko' };
          url += `&with_original_language=${languageMap[selectedOptions.sorting]}`;
        }

        if (searchQuery) {
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko&query=${encodeURIComponent(searchQuery)}`;
        }

        return url;
      };

      try {
        const apiUrl = buildApiUrl();
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies(data.results);
        setError(null);
      } catch (error) {
        console.error('영화 데이터를 가져오는 데 오류가 발생했습니다.', error);
        setError("Failed to load movies.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [selectedOptions, searchQuery]);

  return (
    <div className="movie-search-container">
      <label>선호하는 설정을 선택하세요</label>
      <div className="dropdowns-container">
        {dropdownEntries.map((dropdown) => (
          <div key={dropdown.key} className="custom-select">
            <div className="select-selected" onClick={() => toggleDropdown(dropdown.key)}>
              {selectedOptions[dropdown.key]}
            </div>
            {activeDropdown === dropdown.key && (
              <div className="select-items">
                {dropdown.options.map((option) => (
                  <div key={option} onClick={() => selectOption(dropdown.key, option)}>
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <button className="clear-options" onClick={clearOptions}>
          초기화
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="영화 제목으로 검색"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">검색</button>
      </div>

      {searchHistory.length > 0 && (
        <div className="search-history">
          <h4>검색 기록:</h4>
          <ul>
            {searchHistory.map((query, index) => (
              <li key={index}>
                <span onClick={() => handleSearchHistoryClick(query)}>{query}</span>
                <button onClick={() => removeHistoryItem(query)} className="remove-btn">X</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoading ? (
        <div className="loading-message">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="movie-poster" />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>평점: {movie.vote_average}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieSearch;
