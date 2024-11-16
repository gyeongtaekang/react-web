import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../state/useAuth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignIn.css';

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

  const isLoginFormValid = email && password;
  const isRegisterFormValid =
    registerEmail &&
    registerPassword &&
    confirmPassword &&
    registerPassword === confirmPassword &&
    acceptTerms;

  useEffect(() => {
    // 로컬 스토리지에서 로그인 정보 가져오기
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
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

      const userId = response?.userId || response?.data?.userId;
      if (userId) {
        localStorage.setItem('userId', userId);
        localStorage.setItem('userEmail', email);
      } else {
        console.error('User ID is null or undefined');
      }

      // rememberMe 상태에 따라 로컬 스토리지에 저장/삭제
      if (rememberMe) {
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('savedPassword', password);
        localStorage.setItem('rememberMe', true);
      } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
        localStorage.removeItem('rememberMe');
      }

      toast.success('로그인에 성공했습니다!');
      setTimeout(() => {
        navigate('/');
      }, 100);
    } catch (err) {
      console.error('로그인 오류:', err);
      toast.error(err.message || '로그인에 실패했습니다.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!isRegisterFormValid) {
      toast.error('모든 필드를 올바르게 입력해주세요.');
      return;
    }
    try {
      const response = await handleRegister(registerEmail, registerPassword);
      toast.success('회원가입에 성공했습니다! 로그인 해주세요.');
      toggleCard();
    } catch (err) {
      console.error('회원가입 오류:', err);
      toast.error(err.message || '회원가입에 실패했습니다.');
    }
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
                <span className="checkbox remember">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    name="acceptTerms"
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    required
                  />
                  <label htmlFor="terms" className="read-text">
                    <b>이용 약관</b>에 동의합니다
                  </label>
                </span>
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
      <ToastContainer />
    </div>
  );
}

export default SignIn;
