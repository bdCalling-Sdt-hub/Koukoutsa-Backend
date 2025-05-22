const httpStatus = require("http-status");
const response = require("../config/response");
const { studentService } = require("../services");
const catchAsync = require("../utils/catchAsync");


const createStudent = catchAsync(async (req, res) => {
    // Logic to create a student
    const { _id } = req.user;
    const result = await studentService.createStudent(req.body, _id);

    res.status(httpStatus.CREATED).json(
        response({
            message: "School Created",
            status: "OK",
            statusCode: httpStatus.CREATED,
            data: result,
        })
    );


});
const getAllStudents = catchAsync(async (req, res) => {
    const { _id } = req.user;
    // Logic to get all students
    const result = await studentService.getAllStudents(_id);
    res.status(httpStatus.OK).json(
        response({
            message: "Students retrieved successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: result,
        })
    );
});
const getStudentById = catchAsync(async (req, res) => {
    // Logic to get a student by ID
    res.status(200).send({ message: `Student with ID ${req.params.id} retrieved successfully` });
});
const updateStudent = catchAsync(async (req, res) => {
    // Logic to update a student
    res.status(200).send({ message: `Student with ID ${req.params.id} updated successfully` });
});
const deleteStudent = catchAsync(async (req, res) => {
    // Logic to delete a student
    res.status(200).send({ message: `Student with ID ${req.params.id} deleted successfully` });
});



module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};