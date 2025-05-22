const { Student } = require("../models");


const createStudent = async (studentData, schoolId) => {
    const student = await Student.create({ ...studentData, schoolId });
    return student;
};

const getAllStudents = async (schoolId) => {
    const students = await Student.find({ schoolId })
    return students;
}

const getStudentById = async (studentId) => {
    const student = await Student.findById(studentId);
    return student;
}
const updateStudent = async (studentId, studentData) => {
    const student = await Student.findByIdAndUpdate(studentId, studentData, { new: true });
    return student;
}
const deleteStudent = async (studentId) => {
    const student = await Student.findByIdAndDelete(studentId);
    return student;
}

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
}