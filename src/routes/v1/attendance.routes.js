const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { attendanceValidation } = require("../../validations");
const { attendanceController } = require("../../controllers");
const router = require("express").Router();

// attendance 

router
    .route("/present")
    .post(auth("user"), validate(attendanceValidation.attendance),
        attendanceController.createPresentAttendance);
router
    .route("/onLeave")
    .post(auth("user"), validate(attendanceValidation.attendance),
        attendanceController.createOnLeaveAttendance);

router
    .route("/all-students/:classId")
    .get(auth("common"), attendanceController.getAllStudentsAttendance);

// get students by date 
router 
    .route("/students-by-date")
    .get(auth("common"), attendanceController.getStudentsByDate);


module.exports = router;