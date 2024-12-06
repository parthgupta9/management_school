import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClasses, fetchSubjects, fetchAttendance } from '../../redux/attendance/attendanceSlice';
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AttendanceComponent = () => {
  const dispatch = useDispatch();
  const { classes, subjects, attendance, loading, error } = useSelector((state) => state.attendance);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedClass) {
      setSelectedSubject('');
      dispatch(fetchSubjects(selectedClass));
    }
  }, [selectedClass, dispatch]);

  useEffect(() => {
    if (selectedClass && selectedSubject) {
      dispatch(fetchAttendance({ classId: selectedClass, subjectId: selectedSubject, month: selectedMonth }));
    }
  }, [selectedClass, selectedSubject, selectedMonth, dispatch]);

  const generateMonthOptions = () => [
    { value: '', label: 'All Months' },
    ...['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => ({ value: index + 1, label: month })),
  ];

  // Generate an array of days based on the selected month and year
  const generateDaysInMonth = () => {
    const year = new Date().getFullYear(); // Assuming current year
    const month = parseInt(selectedMonth, 10) - 1; // Convert to zero-indexed month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const renderAttendanceStatus = (attendanceData, day) => {
    const isPresent = attendanceData.some(att => new Date(att.date).getDate() === day);
    return isPresent ? (
      <CheckCircleIcon style={{ color: 'green' }} />
    ) : (
      <CancelIcon style={{ color: 'red' }} />
    );
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Attendance Management</Typography>

      <Box sx={{ display: 'flex', gap: 2, padding: 2, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 3, marginBottom: 3 }}>
        {/* Class Dropdown */}
        <FormControl fullWidth>
          <InputLabel>Select Class</InputLabel>
          <Select label="Select Class" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} sx={{ backgroundColor: '#fff' }}>
            {classes.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.sclassName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Subject Dropdown */}
        <FormControl fullWidth>
          <InputLabel>Select Subject</InputLabel>
          <Select label="Select Subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} sx={{ backgroundColor: '#fff' }}>
            {subjects.map((sub) => (
              <MenuItem key={sub._id} value={sub._id}>
                {sub.subName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Month Dropdown */}
        <FormControl fullWidth>
          <InputLabel>Select Month</InputLabel>
          <Select label="Select Month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} sx={{ backgroundColor: '#fff' }}>
            <MenuItem value="">All Months</MenuItem>
            {generateMonthOptions().map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">Error: {error}</Typography>}

      {attendance.length > 0 ? (
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                {generateDaysInMonth().map(day => (
                  <TableCell key={day} align="center">{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((attStudent) => (
                <TableRow key={attStudent._id}>
                  <TableCell>{attStudent.name}</TableCell>
                  {generateDaysInMonth().map(day => (
                    <TableCell key={day} align="center">
                      {renderAttendanceStatus(attStudent.attendance, day)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          No attendance records found for this selection.
        </Typography>
      )}
    </Box>
  );
};

export default AttendanceComponent;
