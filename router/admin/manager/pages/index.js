const express = require("express");
const { adminController } = require("../../../../controller/admin");

const ManagerPagesRouter = express.Router();

ManagerPagesRouter.post("/:idCate", adminController.Manager.Pages.AddPage);
ManagerPagesRouter.delete("/:id", adminController.Manager.Pages.DeletePage);
ManagerPagesRouter.put("/:id", adminController.Manager.Pages.EditPage);
ManagerPagesRouter.get("/list", adminController.Manager.Pages.GetAll);

module.exports = { ManagerPagesRouter };