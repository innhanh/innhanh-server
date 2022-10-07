const express = require("express");
const { adminController } = require("../../../../controller/admin");
const { BranchRouter } = require("./Branchs");

const ManagerCompanyRouter = express.Router();
ManagerCompanyRouter.use("/branchs", BranchRouter);

ManagerCompanyRouter.post("/add", adminController.Manager.Companys.Add);
ManagerCompanyRouter.put("/:id", adminController.Manager.Companys.Edit);
ManagerCompanyRouter.get("/:id", adminController.Manager.Companys.Detail);


module.exports = {
    ManagerCompanyRouter
}