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

    if (!isValidEmail(email)) {
      toast.error('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      const response = await handleLogin(email, password);
      if (response) {
        // API 키 저장 - 환경 변수와 동일한 키 이름 사용
        localStorage.setItem('REACT_APP_TMDB_API_KEY', password);
        
        // 기존 로그인 상태 유지 로직
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
          localStorage.setItem('savedPassword', password);
          localStorage.setItem('rememberMe', 'true');
        }
        toast.success('로그인 성공!');
        navigate('/');
      }
    } catch (err) {
      toast.error('로그인 실패');
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
    
    // 이메일 유효성 검사
    if (!isValidEmail(registerEmail)) {
      toast.error('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    // API 키 형식 검사 (TMDB API 키는 32자리)
    if (registerPassword.length !== 32) {
      toast.error('올바른 TMDB API 키를 입력해주세요.');
      return;
    }

    try {
      await handleRegister(registerEmail, registerPassword);
      localStorage.setItem('TMDb-Key', registerPassword); // API 키 저장
      toast.success('회원가입에 성공했습니다! 로그인 해주세요.');
      toggleCard();
    } catch (err) {
      console.error('회원가입 오류:', err);
      toast.error('회원가입에 실패했습니다.');
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

  // 이메일 유효성 검사 함수 추가 (기존 코드 바로 아래에 추가)
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      <div className="bg-image"></div>
      <div className="container">
        <div id="phone" className={isLoginVisible ? 'login-active' : 'register-active'}>
          <div id="content-wrapper">
            <div className="card" id="login">
              {/* 로그인 헤더 */}
              <div className="text-center mb-2"> {/* mb-8에서 mb-4로 변경 */}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  로그인
                </h2>
                <div className="flex flex-col items-center space-y-2"> {/* space-y-4에서 space-y-2로 변경 */}
                  <span className="text-gray-500 text-sm">아직 계정이 없으신가요?</span>
                  <button
                    type="button"
                    onClick={toggleCard}
                    className="w-full max-w-xs bg-gradient-to-r from-indigo-600 to-purple-600 
                               text-white py-2 px-4 rounded-lg font-medium 
                               hover:from-indigo-700 hover:to-purple-700 
                               transform transition-all duration-200 hover:scale-[1.02] 
                               active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    회원가입하기
                  </button>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="w-full max-w-md mx-auto p-8 space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder=" "
                    />
                    <label 
                      htmlFor="email"
                      className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all duration-200"
                    >
                      이메일 주소
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder=" "
                    />
                    <label 
                      htmlFor="password"
                      className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all duration-200"
                    >
                      비밀번호(TMDB API KEY)
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors duration-200"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                      로그인 상태 유지
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium 
                          hover:from-indigo-700 hover:to-purple-700 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                          transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                          disabled:opacity-50 disabled:cursor-not-allowed
                          shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      로그인 중...
                    </div>
                  ) : (
                    '로그인'
                  )}
                </button>
              </form>
            </div>
            <div className="card" id="register">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  회원가입
                </h2>
              </div>
              
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      id="register-email"
                      type="email"
                      value={registerEmail}
                      name="registerEmail"
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                               transition-all duration-200 bg-gray-50 hover:bg-white text-black"
                    />
                    <label 
                      htmlFor="register-email"
                      className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all duration-200"
                    >
                      이메일 주소
                    </label>
                  </div>
        
                  <div className="relative">
                    <input
                      id="register-password"
                      type="password"
                      value={registerPassword}
                      name="registerPassword"
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                               transition-all duration-200 bg-gray-50 hover:bg-white text-black"
                    />
                    <label 
                      htmlFor="register-password"
                      className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all duration-200"
                    >
                      비밀번호(TMDB API KEY)
                    </label>
                  </div>
        
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      name="confirmPassword"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                               transition-all duration-200 bg-gray-50 hover:bg-white text-black"
                    />
                    <label 
                      htmlFor="confirm-password"
                      className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all duration-200"
                    >
                      비밀번호(TMDB API KEY) 확인
                    </label>
                  </div>
                </div>
        
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={() => setShowTerms(true)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 
                             focus:ring-indigo-500 transition-colors duration-200"
                  />
                  <label 
                    htmlFor="terms" 
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
                    onClick={handleTermsClick}
                  >
                    <b className="text-indigo-600">이용 약관</b>에 동의합니다
                  </label>
                </div>
        
                <button
                  type="submit"
                  disabled={!isRegisterFormValid || loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                           text-white py-2 rounded-lg font-medium 
                           hover:from-indigo-700 hover:to-purple-700 
                           transform transition-all duration-200 hover:scale-[1.02] 
                           active:scale-[0.98] shadow-lg hover:shadow-xl
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '등록 중...' : '회원가입'}
                </button>
              </form>
        
              <div className="text-center mt-4"> {/* 간격을 좁히기 위해 mt-6에서 mt-4로 변경 */}
                <button
                  type="button"
                  onClick={toggleCard}
                  className="w-full max-w-xs bg-gradient-to-r from-indigo-600 to-purple-600 
                             text-white py-2 px-4 rounded-lg font-medium 
                             hover:from-indigo-700 hover:to-purple-700 
                             transform transition-all duration-200 hover:scale-[1.02] 
                             active:scale-[0.98] shadow-lg hover:shadow-xl mx-auto"
                >
                  이미 계정이 있으신가요? <b>로그인</b>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TermsModal 
        show={showTerms}
        onHide={() => {
          setShowTerms(false);
          setAcceptTerms(false); // 취소 버튼 클릭 시 체크박스 해제
        }}
        onAgree={() => {
          setShowTerms(false);
          setAcceptTerms(true); // 동의 버튼 클릭 시 체크박스 체크
        }}
      />
      <ToastContainer />
    </div>
  );
}

export default SignIn;

<style jsx>{`
  .card {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    overflow: hidden;
  }
`}</style>
