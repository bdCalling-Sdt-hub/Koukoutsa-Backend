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


module.exports = {
    createPresentAttendance,
    createOnLeaveAttendance
};