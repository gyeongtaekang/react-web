import React, { useState, useEffect } from 'react';
import URLService from '../../services/URL';
import './MovieTable.css';

function MovieTable({ fetchUrl }) {
  const urlService = new URLService();
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;

  useEffect(() => {
    const fetchMovies = async () => {
      const fetchedMovies = await urlService.fetchPopularMovies(currentPage);
      setMovies(fetchedMovies);
    };
    fetchMovies();
  }, [fetchUrl, currentPage]);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  return (
    <div className="movie-table">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Title</th>
            <th>Release Date</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={movie.id}>
              <td>{(currentPage - 1) * moviesPerPage + (index + 1)}</td>
              <td>{movie.title}</td>
              <td>{movie.release_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage}</span>
        <button onClick={nextPage}>Next</button>
      </div>
    </div>
  );
}

export default MovieTable;