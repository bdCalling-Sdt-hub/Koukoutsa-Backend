
const express = require("express");
const auth = require("../../middlewares/auth");
const { paymentController } = require("../../controllers");
const validate = require("../../middlewares/validate");
const { paymentValidation } = require("../../validations");
const router = express.Router();



router
    .route("/create")
    .post(auth("user"), validate(paymentValidation.payment), paymentController.createPayment);

router
    .route("/all")
    .get(auth("user"), paymentController.getAllPayment);
router
    .route('/income-statistics')
    .get(auth('common'), paymentController.getIncomeStatistics)

router
    .route("/totaluser-and-totalIncome")
    .get(auth("common"), paymentController.getTotalUserAndTotalIncome);


module.exports = router;
