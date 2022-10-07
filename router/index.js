const express = require("express");
const { adminRouter } = require("./admin");
const { CategoryRouter } = require("./categorys");
const { ImageRouter } = require("./images");
const { MaintenanceRouter } = require("./maintenances");
const { userRouter } = require("./users");

const rootRouter = express.Router();

rootRouter.use("/admin", adminRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/images", ImageRouter);
rootRouter.use("/categorys", CategoryRouter);

rootRouter.use("/maintenances", MaintenanceRouter);


module.exports = {
    rootRouter
}