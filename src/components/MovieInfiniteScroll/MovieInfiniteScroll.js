// src/components/MovieInfiniteScroll/MovieInfiniteScroll.js
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import useFetch from '../../state/useFetch';
import './MovieInfiniteScroll.css';

function MovieInfiniteScroll({ apiKey, genreCode, sortingOrder, voteEverage }) {
  const { data, loading, error } = useFetch(getFetchUrl());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(4);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentView, setCurrentView] = useState('grid'); // 현재 뷰 모드 상태 추가 ('grid' 또는 'table')
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  const gridContainerRef = useRef(null);
  const loadingTriggerRef = useRef(null);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  useEffect(() => {
    setupIntersectionObserver();
    if (data && data.results) {
      filterAndSetMovies(data.results);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [data]);

  const observer = useRef(null);

  function getFetchUrl() {
    return genreCode === '0'
      ? 'https://api.themoviedb.org/3/movie/popular'
      : 'https://api.themoviedb.org/3/discover/movie';
  }

  const setupIntersectionObserver = () => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore && currentView === 'grid') {
          fetchMoreMovies();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (loadingTriggerRef.current) {
      observer.current.observe(loadingTriggerRef.current);
    }
  };

  const filterAndSetMovies = (fetchedMovies) => {
    let filteredMovies = fetchedMovies;

    if (sortingOrder !== 'all') {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.original_language === sortingOrder
      );
    }

    if (voteEverage !== -1 && voteEverage !== -2) {
      filteredMovies = filteredMovies.filter((movie) => 
        movie.vote_average >= voteEverage && movie.vote_average < voteEverage + 1
      );
    } else if (voteEverage === -2) {
      filteredMovies = filteredMovies.filter((movie) => movie.vote_average <= 4);
    }

    setMovies((prevMovies) => [...prevMovies, ...filteredMovies]);
    if (filteredMovies.length === 0) {
      setHasMore(false);
    }
  };

  const fetchMoreMovies = () => {
    if (loading || !hasMore) return;
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const [movies, setMovies] = useState([]);

  const getImageUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg';
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setShowTopButton(scrollTop > 300);
  };

  const scrollToTopAndReset = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    resetMovies();
  };

  const resetMovies = () => {
    setMovies([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  const toggleWishlistHandler = (movie) => {
    dispatch(toggleWishlist(movie));
  };

  const isInWishlist = (movieId) => {
    return wishlist.some((movie) => movie.id === movieId);
  };

  const switchView = () => {
    setCurrentView((prevView) => (prevView === 'grid' ? 'table' : 'grid'));
    resetMovies();
  };

  return (
    <div>
      {/* 전환 버튼을 상단 오른쪽에 배치 */}
      <div className="view-switch" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
        <button onClick={switchView}>
          {currentView === 'grid' ? 'Switch to Table View' : 'Switch to Infinite Scroll'}
        </button>
      </div>

      {currentView === 'grid' ? (
        <div className="movie-grid" ref={gridContainerRef}>
          <div className={`grid-container grid`}>
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => toggleWishlistHandler(movie)}
              >
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                <div className="movie-title">{movie.title}</div>
                {isInWishlist(movie.id) && (
                  <div className="wishlist-indicator">🧡</div>
                )}
              </div>
            ))}
          </div>
          <div ref={loadingTriggerRef} className="loading-trigger">
            {loading && hasMore && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <span>Loading...</span>
              </div>
            )}
          </div>
          {showTopButton && (
            <button onClick={scrollToTopAndReset} className="top-button">
              Top
            </button>
          )}
        </div>
      ) : (
        <div className="movie-table">
          <table>
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {movies.slice((currentPage - 1) * rowSize, currentPage * rowSize).map((movie) => (
                <tr key={movie.id} onClick={() => toggleWishlistHandler(movie)}>
                  <td><img src={getImageUrl(movie.poster_path)} alt={movie.title} /></td>
                  <td>{movie.title}</td>
                  <td>{movie.vote_average}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              Previous
            </button>
            <span>{currentPage}</span>
            <button onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === Math.ceil(movies.length / rowSize)}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieInfiniteScroll;
