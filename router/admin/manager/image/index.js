const express = require("express");
const { adminController } = require("../../../../controller/admin");
const { upload } = require("../../../../middleware/update");


const ImageRouter = express.Router();

ImageRouter.post("/add", upload.single('photo'), adminController.Manager.Images.Upload);
ImageRouter.delete("/:id", adminController.Manager.Images.DeleteImage);
ImageRouter.put("/:id", adminController.Manager.Images.Edit);

module.exports = {
    ImageRouter
}