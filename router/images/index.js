const express = require("express");
const { ImageController } = require("../../controller/images");

const ImageRouter = express.Router();
ImageRouter.get("/:type", ImageController.GetImages)

module.exports = {
    ImageRouter
}