const { Op } = require("sequelize");
const dotenv = require("dotenv").config();
const bcryptjs = require("bcryptjs");
const fs = require("fs");
const { Users, Images } = require("../../models");
const path = require("path");

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

    Manager: {
        Client: {

        },
        Staff: {

        },
        Images: {
            Upload: async (req, res) => {
                const { type } = req.body;
                try {
                    const url = req.protocol + '://' + req.get('host');
                    const pathImage = url + '/public/images/' + req.file.filename;
                    const oldImage = await Images.findOne({
                        where: {
                            [Op.and]: [
                                { type: type },
                                { url: pathImage }
                            ]
                        }
                    });
                    if (oldImage) {
                        return res.status(400).json({ err: "Đường dẫn đã tồn tại!" })
                    } else {
                        const newImage = await Images.create({ type: type, name: req.file.filename, url: pathImage });
                        return res.status(201).json({ banner: newImage, mess: "Thêm mới thành công!" })
                    }
                } catch (error) {
                    return res.status(500).json(error)
                }
            },
            DeleteImage: async (req, res) => {
                const { id } = req.params;
                try {
                    const image = await Images.findOne({
                        where: {
                            id: id
                        }
                    });
                    if (image) {
                        const unLoad = path.join(__dirname, "../../public/images/")
                        fs.unlink(unLoad + image.name, async (err) => {
                            if (err) {
                                return res.status(400).json(err)
                            } else {
                                await Images.destroy({
                                    where: {
                                        id
                                    }
                                })
                                return res.status(200).json({ mess: "Xóa thành công!" })
                            }
                        })
                    } else {
                        return res.status(404).json({ error: "Image not found!" })
                    }
                } catch (error) {
                    return res.status(500).json(error)
                }
            },
            Edit: async () => {

            }
        }
    }
};

module.exports = {
    adminController
}