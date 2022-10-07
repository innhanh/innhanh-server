const express = require("express");
const { ImageController } = require("../../controller/images");

const ImageRouter = express.Router();
ImageRouter.get("/:idCategory", ImageController.GetImages)

module.exports = {
    ImageRouter
}