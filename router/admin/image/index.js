const express = require("express");
const { adminController } = require("../../../controller/admin");
const { ImageController } = require("../../../controller/images");

const AdminImageRouter = express.Router();

AdminImageRouter.get("/:idUser", ImageController.GetAvatar);

module.exports = {
    AdminImageRouter
}