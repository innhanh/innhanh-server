const express = require("express");
const { ImageRouter } = require("./image");

const ManagerRouter = express.Router();

ManagerRouter.use("/images", ImageRouter);

module.exports = {
    ManagerRouter
}