import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlist } from '../../store/slices/wishlistSlice';

function MovieWishlist() {
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length > 0) {
      setLoading(false);
    }
  }, [wishlist]);

  const getImageUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w500${path}` : '/placeholder-image.jpg';
  };

  const toggleWishlistHandler = (movie) => {
    dispatch(toggleWishlist(movie));
  };

  return (
    <div className="bg-gray-800 p-4 min-h-screen">
      {loading ? (
        <div className="text-center text-lg text-gray-400 mt-8">로딩 중...</div>
      ) : wishlist.length === 0 ? (
        <div className="text-center text-lg text-gray-400 mt-8">위시리스트가 비어 있습니다.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
          {wishlist.map((movie) => (
            <div
              key={movie.id}
              className="relative bg-gray-700 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => toggleWishlistHandler(movie)}
              style={{ width: '320px', height: '480px' }} // 카드 크기 고정
            >
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full h-full object-cover" // 카드 안에 이미지 꽉 채우기
              />
              <div className="absolute top-2 right-2 bg-red-600 text-white text-lg p-2 rounded-full">
                ❤️
              </div>
              <div className="p-4 text-white text-center font-semibold truncate">{movie.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieWishlist;
