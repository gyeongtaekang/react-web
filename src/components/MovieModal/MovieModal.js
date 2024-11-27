// src/components/MovieModal/MovieModal.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTimes } from '@fortawesome/free-solid-svg-icons';

const MovieModal = ({ movie, genres, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div 
        className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full mx-4 relative z-10"
        onClick={e => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full 
                     flex items-center justify-center 
                     shadow-lg border border-gray-200
                     text-gray-500 hover:text-gray-700 
                     transition-all duration-200 hover:scale-110"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} size="sm" />
        </button>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full md:w-64 h-auto rounded-lg shadow-lg object-cover"
          />
          
          <div className="flex-1 text-black">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{movie.title}</h2>
            
            <div className="space-y-2 sm:space-y-3 mb-4">
              {movie.vote_average && (
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                  <span className="font-semibold text-black">평점:</span>
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
              
              {movie.release_date && (
                <div className="text-sm sm:text-base">
                  <span className="font-semibold text-black">개봉일:</span>
                  <span className="ml-2">
                    {new Date(movie.release_date).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              )}
              
              {movie.genre_ids && (
                <div className="text-sm sm:text-base">
                  <span className="font-semibold text-black">장르:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {movie.genre_ids.map(id => (
                      <span key={id} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {genres[id]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;