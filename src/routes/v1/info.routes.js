const express = require("express");
const auth = require("../../middlewares/auth");
const httpStatus = require("http-status");
const response = require("../../config/response");
const { AboutUs, Privacy, TermsConditions, Support } = require("../../models");
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

router
    .route('/create-privacy-policy')
    .post(auth("common"), catchAsync(async (req, res) => {
        const content = req.body.content;
        const find = await Privacy.findOne();
        if (find) {
            find.content = content;
            await find.save();
            return res.status(httpStatus.OK).json(
                response({
                    message: "Privacy Policy Updated",
                    status: "OK",
                    statusCode: httpStatus.OK,
                    data: find,
                })
            );
        }

        const about = await Privacy.create({ content: content });
        res.status(httpStatus.OK).json(
            response({
                message: "Privacy Policy Created",
                status: "OK",
                statusCode: httpStatus.OK,
                data: about,
            })
        );
    }));

router
    .route('/get-privacy-policy')
    .get(auth("common"), catchAsync(async (req, res) => {
        const about = await Privacy.findOne();
        res.status(httpStatus.OK).json(
            response({
                message: "Privacy Policy Fetched",
                status: "OK",
                statusCode: httpStatus.OK,
                data: about,
            })
        );
    }));

router
    .route("/create-terms-conditions")
    .post(auth("common"), catchAsync(async (req, res) => {
        const content = req.body.content;
        const find = await TermsConditions.findOne();
        if (find) {
            find.content = content;
            await find.save();
            return res.status(httpStatus.OK).json(
                response({
                    message: "Privacy Policy Updated",
                    status: "OK",
                    statusCode: httpStatus.OK,
                    data: find,
                })
            );
        }

        const about = await TermsConditions.create({ content: content });
        res.status(httpStatus.OK).json(
            response({
                message: "Privacy Policy Created",
                status: "OK",
                statusCode: httpStatus.OK,
                data: about,
            })
        );
    }));

router
    .route("/get-terms-conditions")
    .get(auth("common"), catchAsync(async (req, res) => {
        const about = await TermsConditions.findOne();
        res.status(httpStatus.OK).json(
            response({
                message: "Privacy Policy Fetched",
                status: "OK",
                statusCode: httpStatus.OK,
                data: about,
            })
        );
    }));

router
    .route("/support")
    .post(auth("common"), catchAsync(async (req, res) => {
        const { email, phoneNumber } = req.body;
        const find = await Support.findOne();
        if (find) {
            find.email = email;
            find.phoneNumber = phoneNumber;
            await find.save();
            return res.status(httpStatus.OK).json(
                response({
                    message: "Support Updated",
                    status: "OK",
                    statusCode: httpStatus.OK,
                    data: find,
                })
            );
        }

        const about = await Support.create({ email, phoneNumber });
        res.status(httpStatus.OK).json(
            response({
                message: "Support Created",
                status: "OK",
                statusCode: httpStatus.OK,
                data: about,
            })
        );


    }));

router
    .route("/support")
    .get(auth("common"), catchAsync(async (req, res) => {
        const about = await Support.findOne();
        res.status(httpStatus.OK).json(
            response({
                message: "Privacy Policy Fetched",
                status: "OK",
                statusCode: httpStatus.OK,
                data: about,
            })
        );
    }));


module.exports = router;