// store.js
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import petsSlice from './petsSlice';
import { setAuthToken } from '../api';
import authMiddleware from './authMiddleware';

const store = configureStore({
  reducer: {
    auth: authSlice,
    pets: petsSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware),
});
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}
export default store;
