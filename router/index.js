const express = require("express");
const { adminRouter } = require("./admin");
const { ImageRouter } = require("./images");
const { userRouter } = require("./users");

const rootRouter = express.Router();

rootRouter.use("/admin", adminRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/images", ImageRouter);


module.exports = {
    rootRouter
}