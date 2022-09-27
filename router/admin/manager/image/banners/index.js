const express = require("express");
const { adminController } = require("../../../../../controller/admin");
const { upload } = require("../../../../../middleware/update");

const BannerCarousel = express.Router();

BannerCarousel.post("/add", upload.single('photo'), adminController.Manager.Images.Upload);
BannerCarousel.get("/:carousel", adminController.Manager.Images.GetListImages)

module.exports = {
    BannerCarousel
}