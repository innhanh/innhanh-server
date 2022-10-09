const express = require("express");
const { adminController } = require("../../../../controller/admin");
const { upload } = require("../../../../middleware/update");
const { BranchRouter } = require("./Branchs");

const ManagerCompanyRouter = express.Router();
ManagerCompanyRouter.use("/branchs", BranchRouter);

ManagerCompanyRouter.post("/add", upload.single('photo'), adminController.Manager.Companys.Add);
ManagerCompanyRouter.put("/:id", adminController.Manager.Companys.Edit);
ManagerCompanyRouter.get("/:name", adminController.Manager.Companys.Detail);
ManagerCompanyRouter.delete("/:id", adminController.Manager.Companys.Delete);


module.exports = {
    ManagerCompanyRouter
}