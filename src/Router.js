// src/AppContent.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import Home from './views/Home/Home';
import HomeMain from './views/Home/HomeMain/HomeMain';
import HomeWishlist from './views/Home/HomeWishlist/HomeWishlist';
import HomePopular from './views/Home/HomePopular/HomePopular';
import HomeSearch from './views/Search/HomeSearch';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

function AppContent() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 로딩 상태 시작 후 500ms 동안 유지되도록 함
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeMain />} />
          <Route path="popular" element={<HomePopular />} />
          <Route path="wishlist" element={<HomeWishlist />} />
          <Route path="search" element={<HomeSearch />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppContent;
