const httpStatus = require("http-status");
const { Student } = require("../models");
const School = require("../models/school.model");
const ApiError = require("../utils/ApiError");

const createSchool = async (schoolData, userId) => {

    const school = await School.create({ ...schoolData, schoolId: userId });
    return school;
};

const getSchoolAll = async () => {
    const schools = await School.find();
    return schools;
};
const getSchoolById = async (schoolId) => {
    const school = await School.findById(schoolId);
    return school;
};

const updateSchool = async (schoolId, updateData) => {
    const school = await School.findByIdAndUpdate(schoolId, updateData, { new: true });
    return school;
};
const deleteSchool = async (schoolId) => {
    await School.findByIdAndDelete(schoolId);
};

const addStudentToClass = async (classId, studentId) => {
    const student = await Student.findById(studentId);
    const classData = await School.findById(classId);
    if (!student) {
        throw new ApiError(httpStatus.NOT_FOUND, "Student not found");
    }
    if (!classData) {
        throw new ApiError(httpStatus.NOT_FOUND, "Class not found");
    }
    if (classData.studentsIds.includes(studentId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Student already in class");
    }
    classData.studentsIds.push(studentId);
    student.classId = classId;
    await classData.save();
    await student.save();
    return student;
};


module.exports = {
    createSchool,
    getSchoolById,
    getSchoolAll,
    updateSchool,
    deleteSchool,
    addStudentToClass
};
