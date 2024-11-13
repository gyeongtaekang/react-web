// src/components/SignIn/SignIn.js
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

  // 로그인 폼의 유효성 검사
  const isLoginFormValid = email && password;
  const isRegisterFormValid =
    registerEmail &&
    registerPassword &&
    confirmPassword &&
    registerPassword === confirmPassword &&
    acceptTerms;

  // 페이지 로드 시 로컬 스토리지에 저장된 이메일과 비밀번호 불러오기
  useEffect(() => {
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
    setIsLoginVisible(!isLoginVisible);
    const contentWrapper = document.getElementById('content-wrapper');
    if (contentWrapper) {
      contentWrapper.classList.toggle('hidden');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await handleLogin(email, password); 
      console.log("Full response:", response);

      const userId = response?.userId || response?.data?.userId;
      const userEmail = email;

      if (userId) {
        localStorage.setItem('userId', userId); 
      }

      if (userEmail) {
        localStorage.setItem('userEmail', userEmail); 
      }

      // rememberMe가 true인 경우 이메일과 비밀번호를 저장
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
      console.error("Login error:", err);
      toast.error(err.message || '로그인에 실패했습니다.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await handleRegister(registerEmail, registerPassword);
      toast.success('회원가입에 성공했습니다! 로그인 해주세요.');
      toggleCard();
    } catch (err) {
      toast.error(err.message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div>
      <div className="bg-image"></div>
      <div className="container">
        <div id="phone">
          <div id="content-wrapper">
            {/* 로그인 폼 */}
            <div className={`card ${!isLoginVisible ? 'hidden' : ''}`} id="login">
              <form onSubmit={handleLoginSubmit}>
                <h1>Sign in</h1>
                <div className="input">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="email">Username or Email</label>
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
                  <label htmlFor="password">Password</label>
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
                    Remember me
                  </label>
                </span>
                <button type="submit" disabled={!isLoginFormValid || loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <button type="button" className="account-check" onClick={toggleCard}>
                Don't have an account? <b>Sign up</b>
              </button>
            </div>

            {/* 회원가입 폼 */}
            <div className={`card ${isLoginVisible ? 'hidden' : ''}`} id="register">
              <form onSubmit={handleRegisterSubmit}>
                <h1>Sign up</h1>
                <div className="input">
                  <input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    name="registerEmail"
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="register-email">Email</label>
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
                  <label htmlFor="register-password">Password</label>
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
                  <label htmlFor="confirm-password">Confirm Password</label>
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
                    I have read <b>Terms and Conditions</b>
                  </label>
                </span>
                <button type="submit" disabled={!isRegisterFormValid || loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>
              <button type="button" className="account-check" onClick={toggleCard}>
                Already have an account? <b>Sign in</b>
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
