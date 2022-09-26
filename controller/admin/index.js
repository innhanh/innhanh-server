const { Op } = require("sequelize");
const dotenv = require("dotenv").config();
const bcryptjs = require("bcryptjs");
const { Users, Images } = require("../../models");

const adminController = {
    Authen: {
        Login: async (req, res) => {
            const { userName, pass, key } = req.body;
            try {
                let admin = await Users.findOne({
                    where: {
                        userName: userName
                    }
                });

                if (admin) {
                    if (admin.admin) {
                        if (bcryptjs.compareSync(pass, admin.pass)) {
                            if (key === process.env.KEYADMIN) {
                                return res.status(200).json({ admin, mess: "Đăng nhập thành công!" });
                            } else {
                                return res.status(403).json({ error: "Key admin không chính xác!" });
                            }
                        } else {
                            return res.status(400).json({ error: "Sai mật khẩu!" });
                        }
                    } else {
                        return res.status(404).json({ error: "Không đủ quyền hạn truy cập!" });
                    }

                } else {
                    return res.status(400).json({ error: "Sai tên đăng nhập!" });
                }
            } catch (error) {
                return res.status(500).json(error)
            }
        },
        Logout: async (req, res) => {
            try {
                return res.end();
            } catch (error) {
                return res.status(500).json(error)
            }
        },
        Register: async (req, res) => {
            const { userName, pass, email, tel, key } = req.body;
            try {
                const oldAdmin = await Users.findOne({
                    where: {
                        userName: userName
                    }
                });
                if (oldAdmin) {
                    return res.status(403).json({ error: "Admin đã tồn tại!" });
                } else {
                    if (key === process.env.KEYADMIN) {
                        const salt = bcryptjs.genSaltSync(10);
                        const newPass = bcryptjs.hashSync(pass, salt);
                        const avatar = "http://localhost:8000/public/avatars/user_defau.jpg";
                        const newAdmin = await Users.create({ userName: userName, pass: newPass, email: email, tel: tel, admin: true, avatar: avatar`` });
                        return res.status(201).json({ admin: newAdmin, mess: "Đăng ký Admin thành công!" });
                    } else {
                        return res.status(403).json({ error: "Key admin không chính xác!" });
                    }
                }
            } catch (error) {
                return res.status(500).json(error)
            }
        },
        ChangePass: async (req, res) => {
            const { pass, newPass, reNewPass, idUser } = req.body;
            try {
                if (newPass === reNewPass) {
                    const user = await Users.findOne({
                        where: {
                            id: idUser
                        }
                    });
                    if (user) {
                        if (bcryptjs.compareSync(pass, user.pass)) {
                            const salt = bcryptjs.genSaltSync(10);
                            const passHash = bcryptjs.hashSync(newPass, salt);
                            user.pass = passHash;
                            await user.save();
                            return res.status(200).json({ mess: "Đổi mật khẩu thành công!" })
                        } else {
                            return res.status(403).json({ error: "Mật khẩu không chính xác!" })
                        }
                    } else {
                        return res.status(404).json({ error: "User không tồn tại!" })
                    }
                } else {
                    return res.status(403).json({ error: "newPass # reNewPass" })
                }

            } catch (error) {
                return res.status(500).json(error)
            }
        },
        ChangeKeyAdmin: async (req, res) => {

        },
    },
    Upload: {
        Carourel: async (req, res) => {
            const { type, name } = req.body;
            try {
                const url = req.protocol + '://' + req.get('host');
                const path = url + '/public/images/' + req.file.filename;
                const oldCarousel = await Images.findOne({
                    where: {
                        name: name
                    }
                });
                if (oldCarousel) {
                    return res.status(403).json({ error: "Name đã tồn tại!" })
                } else {
                    const newCarousel = await Images.create({
                        type: type,
                        name: name,
                        url: path
                    });
                    return res.status(200).json({ carousel: newCarousel, mess: "Upload thành công" });
                }

            } catch (error) {
                return res.status(500).json(error)
            }

        },
        InQc: async (req, res) => {

        },
        ListImage: async (req, res) => {
            const { type } = req.params;
            try {
                const list = await Images.findAll({
                    where: {
                        type: type
                    }
                });
                return res.status(200).json({ listImage: list })
            } catch (error) {
                return res.status(500).json(error);
            }
        }
    },
    Manager: {
        ListUser: async (req, res) => {

        },
        UserDetail: async (req, res) => {

        },
        DeleteUser: async (req, res) => {

        }
    }
};

module.exports = {
    adminController
}