// SignIn.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../state/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignIn.css';
import TermsModal from './TermsModal.js';

function SignIn() {
  const { handleLogin, handleRegister, loading } = useAuth();
  const navigate = useNavigate();

  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const isLoginFormValid = email && password;
  const isRegisterFormValid =
    registerEmail &&
    registerPassword &&
    confirmPassword &&
    registerPassword === confirmPassword &&
    acceptTerms;

  // ��장된 로그인 정보를 불러오기  이 부분 수정
  useEffect(() => {
    const loadSavedLoginInfo = () => {
      try {
        const savedEmail = localStorage.getItem('savedEmail');
        const savedPassword = localStorage.getItem('savedPassword');
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

        if (savedEmail && savedPassword && savedRememberMe) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading saved login info:', error);
      }
    };

    loadSavedLoginInfo();
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedEmail && savedPassword && savedRememberMe) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const toggleCard = () => {
    setIsLoginVisible((prev) => !prev);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await handleLogin(email, password);

      const userId = response?.userId || response?.data?.userId || response?.data?.id || response?.id;
      if (!userId) {
        toast.error('로그인 실패: 사용자 정보를 확인할 수 없습니다.');
        return;
      }

      // 로그인 성공 시 localStorage에 정보 저장
      if (email) {
        localStorage.setItem('userId', userId);
        localStorage.setItem('userEmail', email);

        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
          localStorage.setItem('savedPassword', password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
          localStorage.removeItem('rememberMe');
        }

        toast.success('로그인에 성공했습니다!');
        setTimeout(() => {
          navigate('/');
        }, 100);
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      toast.error(err.message || '로그인에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const success = await handleLogin(email, password);
      
      if (success) {
        // 로그인 상태 유지 처리
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberMe');
        }
        
        navigate('/');
      } else {
        toast.error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      toast.error('로그인 중 오류가 발생했습니다.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!isRegisterFormValid) {
      toast.error('모든 필드를 올바르게 입력해주세요.');
      return;
    }
    try {
      await handleRegister(registerEmail, registerPassword);
      toast.success('회원가입에 성공했습니다! 로그인 해주세요.');
      toggleCard();
    } catch (err) {
      console.error('회원가입 오류:', err);
      toast.error(err.message || '회원가입에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('savedEmail');
    localStorage.removeItem('savedPassword');
    localStorage.removeItem('rememberMe');

    setEmail('');
    setPassword('');
    setRememberMe(false);
    toast.success('로그아웃 되었습니다.');
    navigate('/signin');
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    setShowTerms(true);
  };

  const handleTermsAgree = () => {
    setAcceptTerms(true);
    setShowTerms(false);
  };

  return (
    <div>
      <div className="bg-image"></div>
      <div className="container">
        <div id="phone" className={isLoginVisible ? 'login-active' : 'register-active'}>
          <div id="content-wrapper">
            <div className="card" id="login">
              <form onSubmit={handleLoginSubmit}>
                <h1>로그인</h1>
                <div className="input">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="email">이메일 주소</label>
                </div>
                <div className="input">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="password">비밀번호</label>
                </div>
                <span className="checkbox remember">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    name="rememberMe"
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember" className="read-text">
                    로그인 상태 유지
                  </label>
                </span>
                <button type="submit" disabled={!isLoginFormValid || loading}>
                  {loading ? '로그인 중...' : '로그인'}
                </button>
              </form>
              <button type="button" className="account-check" onClick={toggleCard}>
                계정이 없으신가요? <b>회원가입</b>
              </button>
            </div>
            <div className="card" id="register">
              <form onSubmit={handleRegisterSubmit}>
                <h1>회원가입</h1>
                <div className="input">
                  <input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    name="registerEmail"
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="register-email">이메일 주소</label>
                </div>
                <div className="input">
                  <input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    name="registerPassword"
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="register-password">비밀번호</label>
                </div>
                <div className="input">
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    name="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="confirm-password">비밀번호 확인</label>
                </div>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={() => setShowTerms(true)}
                  />
                  <label 
                    htmlFor="terms" 
                    className="read-text"
                    onClick={handleTermsClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <b>이용 약관</b>에 동의합니다
                  </label>
                </div>
                <button type="submit" disabled={!isRegisterFormValid || loading}>
                  {loading ? '등록 중...' : '회원가입'}
                </button>
              </form>
              <button type="button" className="account-check" onClick={toggleCard}>
                이미 계정이 있으신가요? <b>로그인</b>
              </button>
            </div>
          </div>
        </div>
      </div>
      <TermsModal 
        show={showTerms}
        onHide={() => setShowTerms(false)}
        onAgree={() => {
          setAcceptTerms(true);
          setShowTerms(false);
        }}
      />
      <ToastContainer />
    </div>
  );
}

export default SignIn;
