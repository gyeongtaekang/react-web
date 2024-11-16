// src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logout } from '../store/slices/authSlice';

function useAuth() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (email, password) => {
    try {
      const response = await dispatch(loginUser({ email, password })).unwrap();
      return response; // 성공적인 로그인 결과 반환
    } catch (err) {
      console.error("Login error:", err); // 오류 로그 추가
      throw err; // 오류를 호출한 함수로 다시 전달
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const response = await dispatch(registerUser({ email, password })).unwrap();
      return response; // 성공적인 회원가입 결과 반환
    } catch (err) {
      console.error("Register error:", err); // 오류 로그 추가
      throw err; // 오류를 호출한 함수로 다시 전달
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}

export default useAuth;
