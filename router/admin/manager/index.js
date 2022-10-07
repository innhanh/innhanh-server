const express = require("express");
const { ManagerCateRouter } = require("./categorys");
const { ManagerCompanyRouter } = require("./companys");
const { ImageRouter } = require("./image");
const { ManagerLinksRouter } = require("./links");
const { ManagerPagesRouter } = require("./pages");
const { ManagerTextsRouter } = require("./texts");
const { ManagerUsersRouter } = require("./users");

const ManagerRouter = express.Router();

ManagerRouter.use("/images", ImageRouter);

ManagerRouter.use("/users", ManagerUsersRouter);

ManagerRouter.use("/categorys", ManagerCateRouter);

ManagerRouter.use("/pages", ManagerPagesRouter);

ManagerRouter.use("/links", ManagerLinksRouter);

ManagerRouter.use("/texts", ManagerTextsRouter);

ManagerRouter.use("/companys", ManagerCompanyRouter);


module.exports = {
    ManagerRouter
}