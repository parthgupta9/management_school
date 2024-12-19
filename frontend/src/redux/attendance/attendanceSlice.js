// src/redux/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define initial state
const initialState = {
  classes: [],
  subjects: [],
  attendance: [],
  loading: false,
  error: null,
};

// Fetch classes
export const fetchClasses = createAsyncThunk('attendance/fetchClasses', async () => {
  const response = await axios.get('http://localhost:5000/SclassListt');
  return response.data;
});

// Fetch subjects based on selected class
export const fetchSubjects = createAsyncThunk('attendance/fetchSubjects', async (classId) => {
  const response = await axios.get(`http://localhost:5000/AllSubjects/${classId}`);
  return response.data;
});

// Fetch attendance data based on class, subject, and month
export const fetchAttendance = createAsyncThunk('attendance/fetchAttendance', async ({ classId, subjectId, month }) => {
  const response = await axios.get('http://localhost:5000/attendance/filter', {
    params: { classId, subjectId, month },
  });
  return response.data;
});

// Create the slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the actions (not needed for this slice as we're using async thunks)
export const {} = attendanceSlice.actions;

// Export the reducer
export default attendanceSlice.reducer;
