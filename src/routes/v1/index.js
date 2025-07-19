const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const docsRoute = require("./docs.routes");
const schoolRoute = require("./school.routes");
const studentRoute = require("./student.routes");
const attendanceRoute = require("./attendance.routes");
const paymentRoute = require("./payment.routes");
const notificationRoute = require("./notification.routes");
const subscriptionRoute = require("./subscription.routes.js");
const infoRoute = require("./info.routes.js");

const router = express.Router();
 

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/class",
    route: schoolRoute,
  },
  {
    path: "/student",
    route: studentRoute,
  },
  {
    path: "/attendance",
    route: attendanceRoute,
  },
  {
    path: "/subscription",
    route: subscriptionRoute
  },
  {
    path: "/paymnet",
    route: paymentRoute,
  },
  {
    path: "/info",
    route: infoRoute
  },

  {
    path: "/notification",
    route: notificationRoute
  }

];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
