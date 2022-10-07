const express = require("express");
const { MaintenanceController } = require("../../controller/maintenances");
const MaintenanceRouter = express.Router();

MaintenanceRouter.get("/check", MaintenanceController.CheckMaintenance);
MaintenanceRouter.post("/add", MaintenanceController.Add);
MaintenanceRouter.put("/:status", MaintenanceController.Edit); 

module.exports = {
    MaintenanceRouter
}