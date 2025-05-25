const express = require("express");
const { notificationController } = require("../../controllers");
const auth = require("../../middlewares/auth");
const router = express.Router();



router
    .route("/all")
    .get(auth("common"), notificationController.getAllNotifications);

router
    .route("/:id")
    .patch(auth("common"), notificationController.unreadNotification)




module.exports = router;