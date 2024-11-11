// src/components/MovieGrid/MovieGrid.js
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { useInfiniteQuery } from '@tanstack/react-query';
import URLService from '../../services/URL';
import MovieCard from '../MovieCard/MovieCard';
import './MovieGrid.css';

function MovieGrid({ fetchUrl }) {
  const urlService = new URLService();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const gridContainerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['movies', fetchUrl],
    queryFn: ({ pageParam = 1 }) => {
      if (fetchUrl.includes('/movie/popular')) {
        return urlService.fetchPopularMovies(pageParam);
      } else if (fetchUrl.includes('/movie/now_playing')) {
        return urlService.fetchNowPlayingMovies(pageParam);
      } else if (fetchUrl.includes('/discover/movie')) {
        const url = new URL(fetchUrl);
        const genre = url.searchParams.get('with_genres');
        return urlService.fetchMoviesByGenre(genre, pageParam);
      }
      throw new Error('Invalid fetch URL');
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) return undefined;
      return pages.length + 1;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '100px' }
    );

    // loadMoreRef.current 값을 안전하게 참조하기 위해 지역 변수에 저장합니다.
    const loadMoreElement = loadMoreRef.current;

    if (loadMoreElement) {
      observer.observe(loadMoreElement);
    }

    return () => {
      // cleanup 함수에서 loadMoreRef.current 대신 지역 변수를 사용합니다.
      if (loadMoreElement) {
        observer.unobserve(loadMoreElement);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleToggleWishlist = (movie) => {
    dispatch(toggleWishlist(movie));
  };

  const isInWishlist = (movieId) => {
    return wishlist.some((movie) => movie.id === movieId);
  };

  if (isLoading) {
    return (
      <div className="movie-grid">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="movie-grid">
        <div className="error-message">
          영화를 불러오는 중 오류가 발생했습니다: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="movie-grid" ref={gridContainerRef}>
      <div className="grid-container grid">
        {data.pages.map((page, pageIndex) =>
          page.map((movie, movieIndex) => (
            <div className="movie-rank-container" key={movie.id}>
              <div className="movie-rank">{movieIndex + 1 + pageIndex * page.length}</div>
              <MovieCard
                movie={movie}
                onToggleWishlist={handleToggleWishlist}
                isInWishlist={isInWishlist(movie.id)}
              />
            </div>
          ))
        )}
      </div>
      <div ref={loadMoreRef} className="load-more">
        {isFetchingNextPage && <div className="loading-spinner">Loading more...</div>}
        {!hasNextPage && <div className="end-message">더 이상 영화가 없습니다.</div>}
      </div>
    </div>
  );
}

export default MovieGrid;
