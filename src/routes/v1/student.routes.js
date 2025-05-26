const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const router = require("express").Router();
const studentValidation = require("../../validations/student.validation");
const { studentController } = require("../../controllers");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_USERS = "./public/uploads/users";
const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);


router
    .route("/")
    .post(auth("user"),

        validate(studentValidation.createStudent),

        [uploadUsers.single("studentImage")],
        convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
        studentController.createStudent)

    .get(auth("user"), studentController.getAllStudents);

router
    .route("/:id")
    .get(auth("user"), studentController.getStudentById)
    .patch(auth("user"),
        [uploadUsers.single("studentImage")],
        convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
        studentController.updateStudent)
    .delete(auth("user"), studentController.deleteStudent);






module.exports = router;