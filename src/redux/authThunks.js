// features/authThunks.js
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import api, { setAuthToken } from '../api';

export const login = (username, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    // const response = await axios.post('https://ycfbillingbackend.onrender.com/login', { username, password });
    const response = await api.post('/login', { username, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    setAuthToken(token)
    dispatch(loginSuccess(token));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};
