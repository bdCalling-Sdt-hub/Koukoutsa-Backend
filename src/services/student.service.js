const httpStatus = require("http-status");
const { Student } = require("../models");
const ApiError = require("../utils/ApiError");


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

const updateStudent = async (studentId, schoolId, studentData) => {

    const checktoSeeIfStudentExists = await Student.findOne({ _id: studentId, schoolId });

    if (!checktoSeeIfStudentExists) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student does not exist");
    }

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