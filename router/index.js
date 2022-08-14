const express = require("express");
const { adminRouter } = require("./admin");
const { userRouter } = require("./users");

const rootRouter = express.Router();

rootRouter.use("/admin", adminRouter);
rootRouter.use("/user", userRouter);


module.exports = {
    rootRouter
}