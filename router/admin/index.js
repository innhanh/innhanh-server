const express = require("express");
const { adminController } = require("../../controller/admin");

const adminRouter = express.Router();

adminRouter.use("/register", adminController.Authen.Register);
adminRouter.use("/login", adminController.Authen.Login);
adminRouter.use("/logout", adminController.Authen.Logout);
adminRouter.use("/changePass", adminController.Authen.ChangePass);
adminRouter.use("/changeKey", adminController.Authen.ChangeKeyAdmin);

module.exports = {
    adminRouter
}