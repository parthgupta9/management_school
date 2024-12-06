import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../../redux/accounts/userSlice';
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';

const UserList = () => {
  const dispatch = useDispatch();
  
  // State for role filter
  const [roleFilter, setRoleFilter] = useState('');

  const { admins, teachers, students, loading, error } = useSelector((state) => state.userList);

  useEffect(() => {
    dispatch(fetchUsers('admins'));
    dispatch(fetchUsers('teachers'));
    dispatch(fetchUsers('students'));
  }, [dispatch]);

  if (loading) return <CircularProgress />; // Show loading spinner if fetching data
  if (error) return <Typography color="error">{error}</Typography>;

  // Filter users based on selected role
  let filteredUsers = [];
  if (roleFilter === 'admin') {
    filteredUsers = admins;
  } else if (roleFilter === 'teacher') {
    filteredUsers = teachers;
  } else if (roleFilter === 'student') {
    filteredUsers = students;
  } else {
    // If no filter is selected, display all roles
    filteredUsers = [...admins, ...teachers, ...students];
  }

  // Handle role filter change
  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>

      {/* Filter Dropdown */}
      <Grid container spacing={3} sx={{ marginBottom: 2 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Filter by Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              label="Filter by Role"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* User Table */}
      <Paper sx={{ padding: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" size="small">
                        Edit
                      </Button>
                      <Button variant="outlined" color="secondary" size="small" sx={{ ml: 1 }}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>No users found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default UserList;
