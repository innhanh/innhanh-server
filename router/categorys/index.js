const express = require("express");
const { CategoryController } = require("../../controller/categorys");
const CategoryRouter = express.Router();
CategoryRouter.get("/list", CategoryController.GetAll)

module.exports = {
    CategoryRouter
}