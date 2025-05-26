const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const UPLOADS_FOLDER_USERS = "./public/uploads/users";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();


router.route("/self/in").get(auth("common"), userController.getProfile);

router
  .route("/self/update")
  .patch(
    auth("common"),
    validate(userValidation.updateUser),

    [uploadUsers.single("profileImage")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),

    userController.updateProfile
  );



router
  .route("/all")
  .get(
    auth("common"),
    userController.getAllUsers
  );

router
  .route("/:id")
  .get(auth("common"), userController.getUserById)

router
  .route("/dashboard/status")
  .get(auth("common"), userController.getUsersStatus)

router
  .route("/recent/users")
  .get(auth("common"), userController.getRecentUsers)

module.exports = router;
