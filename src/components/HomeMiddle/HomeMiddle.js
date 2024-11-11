import React, { useState, useEffect, useRef } from 'react';
import useFetch from '../../services/useFetch';  // 새로 만든 useFetch 훅 임포트
import URLService from '../../services/URL'; // URLService 임포트
import './HomeMiddle.css';

function HomeMiddle({ title, fetchUrl }) {
  const { data, loading, error } = useFetch(fetchUrl);  // useFetch 사용
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [animationMovies, setAnimationMovies] = useState([]);  // 애니메이션 영화 상태 추가
  const [currentPage, setCurrentPage] = useState(0);
  const [currentAnimationPage, setCurrentAnimationPage] = useState(0);
  const ITEMS_PER_PAGE = 1;
  const sliderRef = useRef(null);

  // URLService 인스턴스 생성
  const urlService = new URLService();

  // 장르 목록을 가져와 상태에 저장하는 useEffect
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await urlService.fetchGenres(); // 수정된 코드
        const genresMap = {};
        genresData.forEach((genre) => {
          genresMap[genre.id] = genre.name;
        });
        setGenres(genresMap);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []); // urlService 의존성 제거로 인해 한 번만 호출

  // 영화 목록을 가져와 상태에 저장하는 useEffect
  useEffect(() => {
    if (data) {
      setMovies(data.results);
    }
  }, [data]);

  // 애니메이션 영화 목록을 가져오는 useEffect
  useEffect(() => {
    const fetchAnimationMovies = async () => {
      try {
        const animationData = await urlService.fetchMoviesByGenre(16);  // 애니메이션 장르 ID로 변경
        setAnimationMovies(animationData);
      } catch (error) {
        console.error("Error fetching animation movies:", error);
      }
    };

    fetchAnimationMovies();
  }, []);  // urlService 의존성 제거로 인해 한 번만 호출

  const getImageUrl = (path) => {
    return `https://image.tmdb.org/t/p/w300${path}`;
  };

  const slide = (direction) => {
    const maxPage = Math.ceil(movies.length / ITEMS_PER_PAGE) - 1;
    if (direction === 'left' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'right' && currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const slideAnimationMovies = (direction) => {
    const maxPage = Math.ceil(animationMovies.length / ITEMS_PER_PAGE) - 1;
    if (direction === 'left' && currentAnimationPage > 0) {
      setCurrentAnimationPage(currentAnimationPage - 1);
    } else if (direction === 'right' && currentAnimationPage < maxPage) {
      setCurrentAnimationPage(currentAnimationPage + 1);
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentPage * 100}%)`;
    }
  }, [currentPage]);

  if (loading) {
    return (
      <div className="movie-row">
        <h2>{title}</h2>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-row">
        <h2>{title}</h2>
        <div className="error-message">Failed to load movies.</div>
      </div>
    );
  }

  return (
    <div>
      {/* 일반 영화 슬라이더 */}
      <div className="movie-row">
        <h2>{title}</h2>
        <div className="slider-container">
          <button
            className={`slider-button left ${currentPage === 0 ? 'hidden' : ''}`}
            onClick={() => slide('left')}
            disabled={currentPage === 0}
          >
            &lt;
          </button>
          <div className="slider-window">
            <div
              className="movie-slider"
              ref={sliderRef}
              style={{
                transform: `translateX(-${currentPage * 100}%)`,
                transition: 'transform 0.5s ease',
                display: 'grid',
                gridTemplateColumns: `repeat(${movies.length}, 310px)`,
                gap: '5px',
              }}
            >
              {movies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                  <div className="movie-overlay">
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                    <p>평점: {movie.vote_average}</p>
                    <p>개봉일: {movie.release_date}</p>
                    <p>장르: {movie.genre_ids.map(id => genres[id]).join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className={`slider-button right ${currentPage === Math.ceil(movies.length / ITEMS_PER_PAGE) - 1 ? 'hidden' : ''}`}
            onClick={() => slide('right')}
            disabled={currentPage === Math.ceil(movies.length / ITEMS_PER_PAGE) - 1}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* 애니메이션 영화 슬라이더 */}
      <div className="movie-row">
        <h2>대세 애니메이션 영화</h2>
        <div className="slider-container">
          <button
            className={`slider-button left ${currentAnimationPage === 0 ? 'hidden' : ''}`}
            onClick={() => slideAnimationMovies('left')}
            disabled={currentAnimationPage === 0}
          >
            &lt;
          </button>
          <div className="slider-window">
            <div
              className="movie-slider"
              style={{
                transform: `translateX(-${currentAnimationPage * 100}%)`,
                transition: 'transform 0.5s ease',
                display: 'grid',
                gridTemplateColumns: `repeat(${animationMovies.length}, 310px)`,
                gap: '5px',
              }}
            >
              {animationMovies.length > 0 ? (
                animationMovies.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                    <div className="movie-overlay">
                      <h3>{movie.title}</h3>
                      <p>{movie.overview}</p>
                      <p>평점: {movie.vote_average}</p>
                      <p>개봉일: {movie.release_date}</p>
                      <p>장르: {movie.genre_ids.map(id => genres[id]).join(', ')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>애니메이션 영화를 불러오는 중...</p>
              )}
            </div>
          </div>
          <button
            className={`slider-button right ${currentAnimationPage === Math.ceil(animationMovies.length / ITEMS_PER_PAGE) - 1 ? 'hidden' : ''}`}
            onClick={() => slideAnimationMovies('right')}
            disabled={currentAnimationPage === Math.ceil(animationMovies.length / ITEMS_PER_PAGE) - 1}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeMiddle;
