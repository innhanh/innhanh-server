const express = require("express");
const { adminController } = require("../../../../controller/admin");

const ManagerCateRouter = express.Router();
ManagerCateRouter.post("/add", adminController.Manager.Categorys.AddCate);
ManagerCateRouter.delete("/:id", adminController.Manager.Categorys.Delete);
ManagerCateRouter.put("/:id", adminController.Manager.Categorys.Edit);
ManagerCateRouter.get("/list", adminController.Manager.Categorys.GetAllCate);


module.exports = {
    ManagerCateRouter
}