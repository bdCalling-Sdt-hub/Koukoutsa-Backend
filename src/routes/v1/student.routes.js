const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const router = require("express").Router();
const studentValidation = require("../../validations/student.validation");
const { studentController } = require("../../controllers");



router
    .route("/")
    .post(auth("user"), validate(studentValidation.createStudent), studentController.createStudent)
    .get(auth("user"), studentController.getAllStudents);

router
    .route("/:id")
    .get(auth("user"), studentController.getStudentById)
    .patch(auth("user"), studentController.updateStudent)
    .delete(auth("user"), studentController.deleteStudent);






module.exports = router;