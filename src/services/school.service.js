const httpStatus = require("http-status");
const { Student, Attendance } = require("../models");
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
    // Find student and class
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

    // Add student to class
    classData.studentsIds.push(studentId);
    student.classId = classId;

    // Save class and student updates
    await classData.save();
    await student.save();

    // Prepare attendance records for ALL students currently in the class
    const attendanceRecords = classData.studentsIds.map(sId => ({
        studentId: sId,
        classId,
        classDate: new Date(),
        attendanceType: "absent",  // default value; adjust as needed
    }));

    // Insert attendance records in bulk
    try {
        await Attendance.insertMany(attendanceRecords);
        console.log(`Attendance records created for ${attendanceRecords.length} students at ${new Date().toISOString()}`);
    } catch (err) {
        console.error("Error creating attendance records:", err);
        // Optional: throw or handle the error according to your logic
    }

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
