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
    const { _id } = req.user;
    // Logic to get a student by ID
    const result = await studentService.getStudentById(req.params.id);
    if (!result) {
        return res.status(httpStatus.NOT_FOUND).json(
            response({
                message: "Student not found",
                status: "Error",
                statusCode: httpStatus.NOT_FOUND,
            })
        );
    }
    res.status(httpStatus.OK).json(
        response({
            message: "Student retrieved successfully",
            status: "OK",
            statusCode: httpStatus.OK,
            data: result,
        })
    )
});
const updateStudent = catchAsync(async (req, res) => {
    const { _id } = req.user;
    // Logic to update a student
    const result = await studentService.updateStudent(req.params.id, _id, req.body);
    res.status(httpStatus.OK).json(
        response({
            message: "Student updated successfully",
            status: "OK",
            statusCode: httpStatus.OK
        })
    );
});
const deleteStudent = catchAsync(async (req, res) => {
    // Logic to delete a student
    const result = await studentService.deleteStudent(req.params.id);
    if (!result) {
        return res.status(httpStatus.NOT_FOUND).json(
            response({
                message: "Student not found",
                status: "Error",
                statusCode: httpStatus.NOT_FOUND,
            })
        );
    }
    res.status(httpStatus.OK).json(
        response({
            message: "Student deleted successfully",
            status: "OK",
            statusCode: httpStatus.OK
        })
    );
});


// cron.shudule 







module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};