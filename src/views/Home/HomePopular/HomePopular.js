// src/views/Home/HomePopular/HomePopular.js
import React, { useState } from 'react';
import MovieGrid from '../../../components/MovieGrid/MovieGrid';
import MovieTable from '../../../components/MovieTable/MovieTable';
import URLService from '../../../services/URL';
import './HomePopular.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faTable } from '@fortawesome/free-solid-svg-icons';

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
      <div className="view-toggle-container">
        <button 
          onClick={handleGridViewClick} 
          className={!isTableView ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faList} title="Infinite Scroll" />
        </button>
        <button 
          onClick={handleTableViewClick} 
          className={isTableView ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faTable} title="Table View" />
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
