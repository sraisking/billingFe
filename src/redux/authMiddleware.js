import { isTokenExpired } from '../utils/isTokenExpired';
import { logout } from './authSlice';

const authMiddleware = (store) => (next) => (action) => {
  const token = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token');
    store.dispatch(logout());
  }
  return next(action);
};

export default authMiddleware;