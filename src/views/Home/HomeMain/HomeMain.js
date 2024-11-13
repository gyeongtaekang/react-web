import React from 'react';
import Banner from '../../../components/Banner/Banner';
import HomeMiddle from '../../../components/HomeMiddle/HomeMiddle';
import URLService from '../../../services/URL';
import { useQuery } from '@tanstack/react-query';

function HomeMain() {
  const urlService = new URLService();

  // 인기 영화 데이터 가져오기
  const { data: featuredMovie, isLoading, isError, error } = useQuery({
    queryKey: ['featuredMovies'],
    queryFn: () => urlService.fetchPopularMovies(1),
    select: (data) => data[0], // 첫 번째 영화를 featuredMovie로 선택
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  // 애니메이션 영화 데이터 가져오기
  const { data: animationMovies, isLoading: isLoadingAnimation, isError: isErrorAnimation, error: errorAnimation } = useQuery({
    queryKey: ['animationMovies'],
    queryFn: () => urlService.fetchMoviesByGenre(16, 1), // 16은 애니메이션 장르 ID
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  // 다큐멘터리 영화 데이터 가져오기
  const { data: documentaryMovies, isLoading: isLoadingDocumentary, isError: isErrorDocumentary, error: errorDocumentary } = useQuery({
    queryKey: ['documentaryMovies'],
    queryFn: () => urlService.fetchMoviesByGenre(99, 1), // 99는 다큐멘터리 장르 ID
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>영화를 불러오는 중 오류가 발생했습니다: {error.message}</p>;

  if (isLoadingAnimation) return <p>애니메이션 영화를 불러오는 중...</p>;
  if (isErrorAnimation) return <p>애니메이션 영화를 불러오는 중 오류가 발생했습니다: {errorAnimation.message}</p>;

  if (isLoadingDocumentary) return <p>다큐멘터리 영화를 불러오는 중...</p>;
  if (isErrorDocumentary) return <p>다큐멘터리 영화를 불러오는 중 오류가 발생했습니다: {errorDocumentary.message}</p>;

  return (
    <div>
      <Banner movie={featuredMovie} />
      <HomeMiddle title="대세 영화" fetchUrl={urlService.getURL4PopularMovies()} />
      <HomeMiddle title="최신 영화" fetchUrl={urlService.getURL4ReleaseMovies()} />
      <HomeMiddle title="대세 애니메이션 영화" fetchUrl={urlService.getURL4GenreMovies(16)} />
      <HomeMiddle title="인기 다큐멘터리" fetchUrl={urlService.getURL4GenreMovies(99)} /> {/* 다큐멘터리 영화 목록 추가 */}
    </div>
  );
}

export default HomeMain;
