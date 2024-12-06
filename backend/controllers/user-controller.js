const Admin = require('../models/adminSchema'); // Assuming you have an Admin model
const Teacher = require('../models/teacherSchema'); // Assuming you have a Teacher model
const Student = require('../models/studentSchema'); // Assuming you have a Student model

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();  // Fetching all admins
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
};

// Get all teachers
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();  // Fetching all teachers
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();  // Fetching all students
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

module.exports = { getAllAdmins, getAllTeachers, getAllStudents };
