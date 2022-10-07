const express = require("express");
const { adminController } = require("../../../controller/admin");

const adminAuthenRouter = express.Router();

adminAuthenRouter.post("/login", adminController.Authen.Login);
adminAuthenRouter.post("/register", adminController.Authen.Register);
adminAuthenRouter.post("/logout", adminController.Authen.Logout);
adminAuthenRouter.put("/changePass", adminController.Authen.ChangePass);
adminAuthenRouter.put("/changeKey", adminController.Authen.ChangeKeyAdmin);

module.exports = {
    adminAuthenRouter
}