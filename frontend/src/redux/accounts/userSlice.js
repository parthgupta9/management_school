import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  admins: [],
  teachers: [],
  students: [],
  loading: false,
  error: null,
};

const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setUsers: (state, action) => {
      const { role, data } = action.payload;
      state[role] = data;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { setLoading, setUsers, setError, clearLoading } = userListSlice.actions;

export const fetchUsers = (role) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.get(`http://localhost:5000/${role}`);
    dispatch(setUsers({ role, data: response.data }));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(clearLoading());
  }
};

export default userListSlice.reducer;
