const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const schoolService = require("../services/school.service");
const response = require("../config/response");




const createSchool = catchAsync(async (req, res) => {
    const { _id } = req.user;
    const school = await schoolService.createSchool(req.body, _id);
    res.status(httpStatus.CREATED).json(
        response({
            message: "School Created",
            status: "OK",
            statusCode: httpStatus.CREATED,
            data: school,
        })
    );
});
const getSchoolAll = catchAsync(async (req, res) => {
    const schools = await schoolService.getSchoolAll();
    res.status(httpStatus.OK).json(
        response({
            message: "All Schools",
            status: "OK",
            statusCode: httpStatus.OK,
            data: schools,
        })
    );
});

const getSchool = catchAsync(async (req, res) => {
    const { schoolId } = req.params;
    const school = await schoolService.getSchoolById(schoolId);
    res.status(httpStatus.OK).json(
        response({
            message: "School Found",
            status: "OK",
            statusCode: httpStatus.OK,
            data: school,
        })
    );
});
const updateSchool = catchAsync(async (req, res) => {
    const { schoolId } = req.params;
    const school = await schoolService.updateSchool(schoolId, req.body);
    res.status(httpStatus.OK).json(
        response({
            message: "School Updated",
            status: "OK",
            statusCode: httpStatus.OK,
            data: school,
        })
    );
});

const deleteSchool = catchAsync(async (req, res) => {
    const { schoolId } = req.params;
    await schoolService.deleteSchool(schoolId);
    res.status(httpStatus.OK).json(
        response({
            message: "School Deleted",
            status: "OK",
            statusCode: httpStatus.OK,
        })
    );
});

const addStudentToClass = catchAsync(async (req, res) => {
    const { classId, studentId } = req.body;
    const school = await schoolService.addStudentToClass(classId, studentId);
    res.status(httpStatus.OK).json(
        response({
            message: "Student Added to Class",
            status: "OK",
            statusCode: httpStatus.OK,
            data: school,
        })
    );
});



module.exports = {
    createSchool,
    getSchoolAll,
    getSchool,
    updateSchool,
    deleteSchool,
    addStudentToClass
};  