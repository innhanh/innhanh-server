const { Op } = require("sequelize");
const dotenv = require("dotenv").config();
const bcryptjs = require("bcryptjs");
const fs = require("fs");
const { Users, Images, Categorys, Companys, Branchs } = require("../../models");
const path = require("path");

const adminController = {
    Authen: {
        Login: async (req, res) => {
            const { userName, pass, key } = req.body;
            try {
                const admin = await Users.findOne({
                    where: {
                        [Op.and]: [
                            { userName: userName },
                            { type: "Admin" }
                        ]
                    }
                });
                if (admin) {
                    if (bcryptjs.compareSync(pass, admin.pass)) {
                        if (key === "innhanh") {
                            return res.status(200).json({ admin: admin, mess: "Login successfully!" });
                        } else {
                            return res.status(400).json({ error: "Key Admin wrong!" })
                        }
                    } else {
                        return res.status(400).json({ error: "Pass wrong!" });
                    }
                } else {
                    return res.status(400).json({ error: "Admin not found!" })
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
            const { userName, pass, email, phone, key } = req.body;
            try {
                if (key === process.env.KEYADMIN) {
                    const oldAdmin = await Users.findOne({
                        where: {
                            [Op.and]: [
                                { userName: userName },
                                { type: "Admin" }
                            ]
                        }
                    });
                    if (oldAdmin) {
                        return res.status(400).json({ error: "Admin is already exist!" })
                    } else {
                        const salt = bcryptjs.genSaltSync(10);
                        const newPass = bcryptjs.hashSync(pass, salt);
                        const baseURL = req.protocol + '://' + req.get('host');
                        const avatar = baseURL + '/public/images/user.png';

                        const admin = await Users.create({
                            userName: userName,
                            pass: newPass,
                            email: email,
                            phone: phone,
                            type: "Admin",
                            avatar: avatar
                        });
                        return res.status(201).json({ Admin: admin, mess: "Register successfully!" })
                    }
                } else {
                    return res.status(400).json({ error: "Key admin wrong!" })
                }
            } catch (error) {
                return res.status(500).json(error);
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
        Users: {
            GetListUsers: async (req, res) => {
                const { type } = req.params;
                try {
                    const list = await Users.findAll({
                        where: {
                            type: type
                        }
                    });
                    return res.status(200).json({ listUsers: list })
                } catch (error) {
                    return res.status(500).json(error);
                }
            },
            DeleteUser: async (req, res) => {
                const { id } = req.params;
                try {
                    const user = await Users.findOne({
                        where: {
                            id: id
                        }
                    });
                    if (user) {
                        await Users.destroy({
                            where: {
                                id: id
                            }
                        });
                        return res.status(200).json({ mess: "Delete success!" })
                    } else {
                        return res.status(400).json({ error: "User not found!" })
                    }
                } catch (error) {
                    return res.status(500).json(error)
                }
            },
            EditUser: async (req, res) => {

            }
        },
        Images: {
            Upload: async (req, res) => {
                const { name } = req.body;
                const { idType } = req.params;
                try {
                    const baseURL = req.protocol + '://' + req.get('host');
                    const pathImage = baseURL + '/public/images/' + req.file.filename;

                    const type = await TypeImages.findOne({
                        where: {
                            id: idType
                        }
                    })
                    if (type) {
                        const oldImage = await Images.findOne({
                            where: {
                                url: pathImage
                            }
                        });
                        if (oldImage) {
                            return res.status(400).json({ error: "Image is already exist!" });
                        } else {
                            const newBanner = await Images.create({
                                name: name,
                                idType: idType,
                                url: pathImage,
                                fileName: req.file.filename
                            });
                            return res.status(201).json({ banner: newBanner, mess: "Thêm mới thành công!" })
                        }
                    } else {
                        return res.status(400).json({ error: "TypeImage is already exist!" })
                    }


                } catch (error) {
                    return res.status(500).json(error);
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
                        fs.unlink(unLoad + image.fileName, async (err) => {
                            if (err) {
                                return res.status(400).json(err)
                            } else {
                                await Images.destroy({
                                    where: {
                                        id: id
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
        },
        Categorys: {
            AddCate: async (req, res) => {
                const { name, link } = req.body;
                try {
                    const oldCate = await Categorys.findOne({
                        where: {
                            [Op.and]: [
                                { name: name },
                                { link: link }
                            ]
                        }
                    });
                    if (oldCate) {
                        return res.status(400).json({ error: "Danh mục đã tồn tại!" })
                    } else {
                        const newCate = await Categorys.create({ name: name, link: link });
                        return res.status(201).json({ newCate: newCate, mess: "Thêm mới thành công!" })

                    }
                } catch (error) {
                    return res.status(500).json(error)
                }
            },
            Delete: async (req, res) => {
                const { id } = req.params;
                try {
                    const cate = await Categorys.findOne({
                        where: {
                            id: id
                        }
                    });
                    if (cate) {
                        await Categorys.destroy({
                            where: {
                                id: id
                            }
                        });
                        return res.status(200).json({ mess: "Xóa thành công!" });
                    } else {
                        return res.status(400).json({ error: "Category not found!" })
                    }
                } catch (error) {
                    return res.status(500).json(error);
                }
            },
            Edit: async (req, res) => {
                const { id } = req.params;
                const { newName, newLink } = req.body;
                try {
                    const cate = await Categorys.findOne({
                        where: {
                            id: id
                        }
                    });
                    if (cate) {
                        cate.name = newName;
                        cate.link = newLink;
                        await cate.save();
                        return res.status(200).json({ Cate: cate, mess: "Cập nhật thành công!" });
                    } else {
                        return res.status(400).json({ error: "Category not found!" })
                    }
                } catch (error) {
                    return res.status(500).json(error);
                }
            },
            GetAllCate: async (req, res) => {
                try {
                    const list = await Categorys.findAll();
                    return res.status(200).json({ listCate: list });
                } catch (error) {
                    return res.status(500).json(error);
                }
            },
        },
        Links: {
            AddLink: async (req, res) => {

            },
            DeleteLink: async (req, res) => {

            },
            EditLink: async (req, res) => {

            },
            GetAll: async (req, res) => {

            },
        },
        Pages: {
            AddPage: async (req, res) => {

            },
            DeletePage: async (req, res) => {

            },
            EditPage: async (req, res) => {

            },
            GetAll: async (req, res) => {

            },
        },
        Texts: {
            AddText: async (req, res) => {

            },
            DeleteText: async (req, res) => {

            },
            EditText: async (req, res) => {

            },
            GetAll: async (req, res) => {

            },
        },
        Companys: {
            Add: async (req, res) => {
                const { name, website, timeWorlk, hotline } = req.body;

                try {
                    const oldInNhanh = await Companys.findOne();
                    if (oldInNhanh) {
                        return res.status(400).json({ error: "Company is already exist!" })
                    } else {
                        const company = await Companys.create({
                            name: name,
                            logo: "",
                            website: website,
                            timeWorlk: timeWorlk,
                            hotline: hotline
                        });
                        return res.status(201).json({ Company: company, mess: "Add successfully!" })
                    }
                } catch (error) {
                    return res.status(500).json(error);
                }
            },
            Edit: async (req, res) => {
                const { newName, newWebsite, newTimeworlk, newHotline } = req.body;
                const { id } = req.params;
                try {
                    const company = await Companys.findOne({
                        where: {
                            id: id
                        }
                    });
                    if (company) {
                        company.name = newName;
                        company.website = newWebsite;
                        company.timeWorlk = newTimeworlk;
                        company.hotline = newHotline;
                        await company.save();
                        return res.status(200).json({ Company: company, mess: "Edit successfully!" })
                    }
                } catch (error) {
                    return res.status(500).json(error);
                }
            },
            Detail: async (req, res) => {
                const { id } = req.params;
                try {
                    const company = await Companys.findOne({
                        where: {
                            id: id
                        },
                        include: { model: Branchs }
                    });
                    if (company) {
                        return res.status(200).json({ Company: company })
                    } else {
                        return res.status(404).json({ error: "Company is already exist!" })
                    }
                } catch (error) {
                    return res.status(500).json(error);
                }
            },
            Branchs: {
                Add: async (req, res) => {
                    const { idCompany } = req.params;
                    const { name, adress, phone, email, zalo } = req.body;
                    try {
                        const company = await Companys.findOne({
                            where: {
                                id: idCompany
                            }
                        });
                        if (company) {
                            const oldBranch = await Branchs.findOne({
                                where: {
                                    [Op.and]: [
                                        { name: name },
                                        { idCompany: company.id }
                                    ]
                                }
                            });
                            if (oldBranch) {
                                return res.status(400).json({ error: "Branch is already exist!" })
                            } else {
                                const newBranch = await Branchs.create({
                                    name: name,
                                    adress: adress,
                                    phone: phone,
                                    email: email,
                                    zalo: zalo,
                                    idCompany: company.id
                                });
                                return res.status(201).json({ Branch: newBranch, mess: "Add Successfully!" })
                            }
                        } else {
                            return res.status(404).json({ error: "Company is already exist!" })
                        }
                    } catch (error) {
                        return res.status(500).json(error);
                    }
                },
                Edit: async (req, res) => {
                    const { id } = req.params;
                    const { newName, newAdress, newPhone, newEmail, newZalo } = req.body;
                    try {
                        const branch = await Branchs.findOne({
                            where: {
                                id: id
                            }
                        });
                        if (branch) {
                            branch.name = newName;
                            branch.adress = newAdress;
                            branch.phone = newPhone;
                            branch.email = newEmail;
                            branch.zalo = newZalo;
                            await branch.save();
                            return res.status(200).json({ Branch: branch, mess: "Update successfully!" })
                        } else {
                            return res.status(404).json({ error: "Branch is already exist!" })
                        }
                    } catch (error) {
                        return res.status(500).json(error);
                    }
                },
                List: async (req, res) => {
                    const { idCompany } = req.params;
                    try {
                        const list = await Branchs.findAll({
                            where: {
                                idCompany: idCompany
                            }
                        });
                        const count = await Branchs.count({
                            where: {
                                idCompany: idCompany
                            }
                        })
                        return res.status(200).json({ List: list, Count: count })
                    } catch (error) {
                        return res.status(500).json(error);
                    }
                },
                Delete: async (req, res) => {
                    const { id } = req.params;
                    try {
                        const branch = await Branchs.findOne({
                            where: {
                                id: id
                            }
                        });
                        if (branch) {
                            await Branchs.destroy({
                                where: {
                                    id: id
                                }
                            });
                            return res.status(200).json({ mess: "Delete successfully!" })
                        } else {
                            return res.status(404).json({ error: "Branch is already exits!" })
                        }
                    } catch (error) {
                        return res.status(500).json(error);
                    }
                },
            }
        }
    }
};

module.exports = {
    adminController
}