import React, { useState, useEffect } from 'react';
import useFetch from '../../services/useFetch';
import URLService from '../../services/URL';
import MovieModal from '../MovieModal/MovieModal';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/slices/wishlistSlice';

function HomeMiddle({ title, fetchUrl }) {
  const { data, loading, error } = useFetch(fetchUrl);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  const urlService = new URLService();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await urlService.fetchGenres();
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
  }, []);

  useEffect(() => {
    if (data) {
      setMovies(data.results);
    }
  }, [data]);

  const handleWishlistToggle = (movie) => {
    dispatch(toggleWishlist(movie));
  };

  const isInWishlist = (movieId) => {
    return wishlist.some((movie) => movie.id === movieId);
  };

  return (
    <div className="movie-row flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card cursor-pointer overflow-hidden rounded-lg relative transform transition-transform duration-300 hover:scale-105"
            onClick={() => setSelectedMovie(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlistToggle(movie);
                }}
                className={`w-full py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-lg ${
                  isInWishlist(movie.id) 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600' 
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                }`}
              >
                {isInWishlist(movie.id) ? '찜해제' : '찜하기'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie}
          genres={genres}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}

export default HomeMiddle;
