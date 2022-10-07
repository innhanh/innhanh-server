const express = require("express");
const { adminController } = require("../../../../../controller/admin");

const BranchRouter = express.Router();
BranchRouter.post("/:idCompany", adminController.Manager.Companys.Branchs.Add);
BranchRouter.put("/:id", adminController.Manager.Companys.Branchs.Edit);
BranchRouter.delete("/:id", adminController.Manager.Companys.Branchs.Delete);
BranchRouter.get("/:idCompany", adminController.Manager.Companys.Branchs.List);
module.exports = {
    BranchRouter
}