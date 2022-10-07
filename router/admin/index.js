const express = require("express");
const { adminController } = require("../../controller/admin");
const { upload } = require("../../middleware/update");
const { adminAuthenRouter } = require("./authen");
const { AdminImageRouter } = require("./image");
const { ManagerRouter } = require("./manager");

const adminRouter = express.Router();

adminRouter.use("/authen", adminAuthenRouter);

adminRouter.use("/manager", ManagerRouter);

adminRouter.use("/images", AdminImageRouter);


module.exports = {
    adminRouter
}