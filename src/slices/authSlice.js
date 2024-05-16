import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  //check if userifo present in local storage use it else null
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // set  userinfo in local storage
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      localStorage.setItem('name',JSON.stringify(action.payload.name).replace(/"/g, ''))
      localStorage.setItem('email',JSON.stringify(action.payload.email).replace(/"/g, ''))
    },
    // clear local storage it different from actual logout which send to backend
    // it just clear credential form local storage it like frontend logout
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
    },
  },
});

// export actions
export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
