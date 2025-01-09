//Manages authentication state globally.

import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
  },
  reducers: {
    setAuthToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('authToken', action.payload);
    },
    clearAuthToken(state) {
      state.token = null;
      localStorage.removeItem('authToken');
    },
  },
});

export const { setAuthToken, clearAuthToken } = authSlice.actions;
export default authSlice.reducer;
