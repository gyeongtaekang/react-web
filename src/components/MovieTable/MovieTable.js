import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import URLService from '../../services/URL';
import './MovieTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const genreMap = {
  28: '액션',
  12: '모험',
  16: '애니메이션',
  35: '코미디',
  80: '범죄',
  99: '다큐멘터리',
  18: '드라마',
  10751: '가족',
  14: '판타지',
  36: '역사',
  27: '공포',
  10402: '음악',
  9648: '미스터리',
  10749: '로맨스',
  878: 'SF',
  10770: 'TV 영화',
  53: '스릴러',
  10752: '전쟁',
  37: '서부'
};

const getGenreNames = (genreIds) => {
  if (!genreIds) return '-';
  return genreIds.map(id => genreMap[id] || id).join(', ');
};

const createPageNumbers = (currentPage, totalPages) => {
  let pages = [];
  const DOTS = '...';
  
  if (totalPages <= 7) {
    // 7페이지 이하면 모든 페이지 표시
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    // 현재 페이지가 앞쪽일 때
    pages = [1, 2, 3, 4, DOTS, totalPages];
  } else if (currentPage >= totalPages - 2) {
    // 현재 페이지가 뒤쪽일 때
    pages = [1, DOTS, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    // 현재 페이지가 중간일 때
    pages = [1, DOTS, currentPage - 1, currentPage, currentPage + 1, DOTS, totalPages];
  }

  return pages;
};

function MovieTable({ fetchUrl }) {
  const urlService = new URLService();
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;
  const totalPages = 10; // Assuming total pages is 10 for now

  useEffect(() => {
    const fetchMovies = async () => {
      const fetchedMovies = await urlService.fetchPopularMovies(currentPage);
      setMovies(fetchedMovies);
    };
    fetchMovies();
  }, [fetchUrl, currentPage]);

  return (
    <div className="movie-table-container">
      <table className="movie-table">
        <thead>
          <tr>
            <th>순위</th>
            <th>포스터</th>
            <th>제목</th>
            <th>개봉일</th>
            <th>평점</th>
            <th>장르</th>
            <th>줄거리</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={movie.id} className="movie-row">
              <td>{(currentPage - 1) * moviesPerPage + (index + 1)}</td>
              <td className="poster-cell">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
              </td>
              <td className="title-cell">{movie.title}</td>
              <td>{new Date(movie.release_date).toLocaleDateString('ko-KR')}</td>
              <td className="rating-cell">
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(movie.vote_average / 2) ? 'star filled' : 'star'}
                    />
                  ))}
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
              </td>
              <td>{getGenreNames(movie.genre_ids)}</td>
              <td className="overview-cell">
                <div className="overview">{movie.overview}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {createPageNumbers(currentPage, totalPages).map((page, index) => (
          <span key={index} 
            className={`page-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
            onClick={() => page !== '...' && setCurrentPage(page)}
          >
            {page}
          </span>
        ))}
        <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}

export default MovieTable;