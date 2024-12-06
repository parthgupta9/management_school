// attendanceController.js
const mongoose = require('mongoose')
const Class = require('../models/sclassSchema'); // Assuming you have a Class model
const Subject = require('../models/subjectSchema'); // Assuming you have a Subject model
const Student = require('../models/studentSchema')


// Controller to fetch the list of classes for a specific school
exports.getClasses = async (req, res) => {
    try {
        const classes = await Class.find(); // Fetch all classes without filtering by schoolId
        res.json(classes);
    } catch (error) {
        console.error("Error fetching classes:", error.message);
        res.status(500).json({ message: "Error fetching classes", error: error.message });
    }
};


// Controller to fetch the list of subjects for a specific class
exports.getSubjectsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const cleanedClassId = classId.trim(); // Trim any leading/trailing whitespace or newlines

        // Validate if cleanedClassId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(cleanedClassId)) {
            return res.status(400).json({ message: 'Invalid class ID format' });
        }

        const subjects = await Subject.find({ sclassName: cleanedClassId }).populate('teacher');

        if (!subjects || subjects.length === 0) {
            return res.status(404).json({ message: 'No subjects found for this class' });
        }

        res.json(subjects); // Send the subjects back as a response
    } catch (error) {
        console.error("Error fetching subjects:", error.message);
        res.status(500).json({ message: "Error fetching subjects", error: error.message });
    }
};



// Controller to filter attendance based on class, subject, month, and year
exports.filterAttendance = async (req, res) => {
    const { classId, subjectId, month } = req.query;

    try {
        // Find all students in the given class
        const students = await Student.find({ 'sclassName': classId });

        // Filter attendance based on subjectId and month
        const filteredAttendance = students.map(student => {
            const attendance = student.attendance.filter(att => {
                // Check if the subject matches
                const isSubjectMatch = att.subName.toString() === subjectId;

                // Extract month from date and compare
                const attMonth = new Date(att.date).getMonth() + 1; // JavaScript months are 0-indexed (0 = January)
                const isMonthMatch = !month || attMonth === parseInt(month);  // If no month is selected, match all months

                return isSubjectMatch && isMonthMatch;
            });

            return { studentId: student._id, name: student.name, attendance };
        });

        res.json(filteredAttendance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance", error });
    }
};