const express = require("express");
const validate = require("../../middlewares/validate");
const router = express.Router();


const schoolValidation = require("../../validations/school.validation");
const schoolController = require("../../controllers/school.controller");
const auth = require("../../middlewares/auth");


router
    .route("/")
    .post(auth("user"), validate(schoolValidation.createSchool), schoolController.createSchool)
    .get(auth("user"), schoolController.getSchoolAll)

router
    .route("/school-all-classes")
    .get(auth("user"), schoolController.getSchoolAllClasses) 

router
    .route("/:schoolId")
    .get(auth("user"), schoolController.getSchool)
    .patch(auth("user"), schoolController.updateSchool)
    .delete(auth("user"), schoolController.deleteSchool); 

router
    .route("/add-student")
    .post(auth("user"), validate(schoolValidation.addStudent), schoolController.addStudentToClass);

module.exports = router;
