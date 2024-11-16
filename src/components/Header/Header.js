import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollUp, setIsScrollUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // 저장된 이메일 상태
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (window.scrollY > lastScrollY) {
        setIsScrollUp(true);
      } else {
        setIsScrollUp(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    // Retrieve savedEmail from localStorage
    const storedEmail = localStorage.getItem('savedEmail'); // savedEmail 읽기
    if (storedEmail) {
      setUserEmail(storedEmail); // 상태에 저장
      console.log('Set userEmail state from savedEmail:', storedEmail); // 디버깅용 로그
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const removeKey = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('savedEmail'); // 로그아웃 시 savedEmail 제거
    setUserEmail(null); // 상태 초기화
    navigate('/signin'); // 로그인 페이지로 이동
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div id="container">
      <header className={`app-header ${isScrolled ? 'scrolled' : ''} ${isScrollUp ? 'scroll-up' : ''}`}>
        <div className="header-left">
          <div className="logo">
            <Link to="/">
              <img src="/lolo.png" alt="Logo" style={{ height: '100px', width: '100px' }} />
            </Link>
          </div>
          <nav className="nav-links desktop-nav">
            <ul>
              <li><Link to="/">홈</Link></li>
              <li><Link to="/popular">대세 콘텐츠</Link></li>
              <li><Link to="/wishlist">내가 찜한 리스트</Link></li>
              <li><Link to="/search">찾아보기</Link></li>
            </ul>
          </nav>
        </div>
        <div className="header-right">
          {userEmail ? (
            <div className="user-info">
              <span className="user-email">{userEmail}</span> {/* 저장된 이메일 표시 */}
              <button className="icon-button logout-button" onClick={removeKey}>
                로그아웃
              </button>
            </div>
          ) : (
            <button className="icon-button" onClick={() => navigate('/signin')}>
              <FontAwesomeIcon icon={faUser} />
            </button>
          )}
          <button className="icon-button mobile-menu-button" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </header>

      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <nav>
          <ul>
            <li><Link to="/" onClick={toggleMobileMenu}>홈</Link></li>
            <li><Link to="/popular" onClick={toggleMobileMenu}>대세 콘텐츠</Link></li>
            <li><Link to="/wishlist" onClick={toggleMobileMenu}>내가 찜한 리스트</Link></li>
            <li><Link to="/search" onClick={toggleMobileMenu}>찾아보기</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;
