const httpStatus = require("http-status");
const response = require("../config/response");
const catchAsync = require("../utils/catchAsync");
const { attendanceService } = require("../services");



const createPresentAttendance = catchAsync(async (req, res) => {
    const data = req.body;
    // Logic to create attendance
    const result = await attendanceService.createPresentAttendance(data);

    res.status(httpStatus.CREATED).json(
        response({
            message: `Students Present successfully`,
            status: "OK",
            statusCode: httpStatus.CREATED,
            data: result,
        })
    );
});

const createOnLeaveAttendance = catchAsync(async (req, res) => {
    const data = req.body;
    // Logic to create attendance
    const result = await attendanceService.createOnLeaveAttendance(data);

    res.status(httpStatus.CREATED).json(
        response({
            message: `Students On Leave successfully`,
            status: "OK",
            statusCode: httpStatus.CREATED,
            data: result,
        })
    );
});
const getAllStudentsAttendance = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { classId } = req.params;
    // Logic to get all students attendance
    const result = await attendanceService.getAllStudentsAttendance({ userId: _id, classId });

    res.status(httpStatus.OK).json(
        response({
            message: `All Students Attendance fetched successfully`,
            status: "OK",
            statusCode: httpStatus.OK,
            data: result,
        })
    );
});

const getStudentsByDate = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const { classId, date } = req.query;
    // Logic to get all students attendance
    const result = await attendanceService.getStudentsByDate({ userId: _id, classId, date });

    res.status(httpStatus.OK).json(
        response({
            message: `All Students Attendance fetched successfully`,
            status: "OK",
            statusCode: httpStatus.OK,
            data: result,
        })
    );
});

module.exports = {
    createPresentAttendance,
    createOnLeaveAttendance,
    getAllStudentsAttendance,
    getStudentsByDate
};