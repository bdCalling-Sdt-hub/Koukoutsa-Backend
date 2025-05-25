const express = require("express");
const auth = require("../../middlewares/auth");
const httpStatus = require("http-status");
const response = require("../../config/response");
const { AboutUs } = require("../../models");
const catchAsync = require("../../utils/catchAsync");
const router = express.Router();


router
    .route("/create-about")
    .post(auth("common"), catchAsync(async (req, res) => {
        const content = req.body.content;
        const find = await AboutUs.findOne();
        if (find) {
            find.content = content;
            await find.save();
            return res.status(httpStatus.OK).json(
                response({
                    message: "About Updated",
                    status: "OK",
                    statusCode: httpStatus.OK,
                    data: find,
                })
            );
        }

        const about = await AboutUs.create({ content });
        res.status(httpStatus.OK).json(
            response({
                message: "About Created",
                status: "OK",
                statusCode: httpStatus.OK,
                data: about,
            })
        );
    }));

router
    .route("/get-about")
    .get(auth("common"), catchAsync(async (req, res) => {
        const about = await AboutUs.findOne();
        res.status(httpStatus.OK).json(
            response({
                message: "About Fetched",
                status: "OK",
                statusCode: httpStatus.OK,
                data: about,
            })
        );
    }));



module.exports = router;