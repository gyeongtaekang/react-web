// src/views/Home/HomePopular/HomePopular.js
import React, { useState } from 'react';
import MovieGrid from '../../../components/MovieGrid/MovieGrid';
import MovieTable from '../../../components/MovieTable/MovieTable';
import URLService from '../../../services/URL';
import './HomePopular.css';

function HomePopular() {
  const urlService = new URLService();
  const fetchUrl = urlService.getURL4PopularMovies();
  const [isTableView, setIsTableView] = useState(false);

  const handleGridViewClick = () => {
    setIsTableView(false);
  };

  const handleTableViewClick = () => {
    setIsTableView(true);
  };

  return (
    <div className="home-popular">
      <div className="view-toggle-buttons">
        <button 
          onClick={handleGridViewClick} 
          className={!isTableView ? 'active' : ''}
        >
          Infinite Scroll
        </button>
        <button 
          onClick={handleTableViewClick} 
          className={isTableView ? 'active' : ''}
        >
          Table View
        </button>
      </div>
      {isTableView ? (
        <MovieTable fetchUrl={fetchUrl} />
      ) : (
        <MovieGrid fetchUrl={fetchUrl} />
      )}
    </div>
  );
}

export default HomePopular;
