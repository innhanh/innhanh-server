const express = require("express");
const { adminController } = require("../../../../controller/admin");

const ManagerLinksRouter = express.Router();

ManagerLinksRouter.post("/add", adminController.Manager.Links.AddLink);
ManagerLinksRouter.delete("/:id", adminController.Manager.Links.DeleteLink);
ManagerLinksRouter.put("/:id", adminController.Manager.Links.EditLink);
ManagerLinksRouter.get("/list", adminController.Manager.Links.GetAll);

module.exports = { ManagerLinksRouter };