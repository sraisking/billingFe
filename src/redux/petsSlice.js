// petsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../api';

// Define the initial state
const initialState = {
  pets: [],
  loading: false,
  error: null,
};

// Create an async thunk for fetching pets data
export const fetchPets = createAsyncThunk('pets/fetchPets', async () => {
  const response = await api.get('/pets');
  // const response = await axios.get('https://ycfbillingbackend.onrender.com/pets');
  return response.data;
});

// Create the pets slice
const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.loading = false;
        state.pets = action.payload;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default petsSlice.reducer;
