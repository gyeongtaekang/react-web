import React, { useState, useEffect } from 'react';
import useFetch from '../../services/useFetch';
import URLService from '../../services/URL';
import MovieModal from '../MovieModal/MovieModal';

function HomeMiddle({ title, fetchUrl }) {
  const { data, loading, error } = useFetch(fetchUrl);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);

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

  const getImageUrl = (path) => {
    return `https://image.tmdb.org/t/p/w300${path}`;
  };

  if (loading) {
    return (
      <div className="movie-row flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-row flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="text-red-500">Failed to load movies.</div>
      </div>
    );
  }

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
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
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
