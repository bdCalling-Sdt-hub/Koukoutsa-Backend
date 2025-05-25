const express = require("express");
const auth = require("../../middlewares/auth");
const { subscriptionController } = require("../../controllers");
const router = express.Router();



router
    .route("/")
    .post(auth("commonAdmin"), subscriptionController.createSubscription)
    .get(auth("commonAdmin"), subscriptionController.getAllSubscription);

router
    .route("/:id")
    .get(auth("commonAdmin"), subscriptionController.getSubscriptionById)
    .patch(auth("commonAdmin"), subscriptionController.updateSubscription)
    .delete(auth("commonAdmin"), subscriptionController.deleteSubscription);



module.exports = router;
