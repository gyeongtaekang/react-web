// src/hooks/useFetch.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY; // API 키 설정

/**
 * useFetch 훅 (react-query v5 호환)
 * @param {string} url - 데이터 패칭을 위한 URL
 * @param {object} params - API 요청 시 사용할 쿼리 파라미터
 * @returns {object} - react-query의 useQuery 반환값
 */
function useFetch(url, params = {}) {
  return useQuery({
    queryKey: [url, params],
    queryFn: async () => {
      // URL에 API 키를 추가하여 완전한 URL 생성
      const fullUrl = `${url}?api_key=${API_KEY}`;
      const { data } = await axios.get(fullUrl, { params });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5분
    cacheTime: 1000 * 60 * 30, // 30분
    keepPreviousData: true,
  });
}

export default useFetch;
