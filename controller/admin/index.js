const { Op } = require("sequelize");
const dotenv = require("dotenv").config();
const bcryptjs = require("bcryptjs");
const fs = require("fs");
const { Users, Images, Categorys, Companys, Branchs, Links } = require("../../models");
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
                            return res.status(200).json({ mess: "?????i m???t kh???u th??nh c??ng!" })
                        } else {
                            return res.status(403).json({ error: "M???t kh???u kh??ng ch??nh x??c!" })
                        }
                    } else {
                        return res.status(404).json({ error: "User kh??ng t???n t???i!" })
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
                const { name, type } = req.body;
                try {
                    const baseURL = req.protocol + '://' + req.get('host');
                    const pathImage = baseURL + '/public/images/' + req.file.filename;

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
                            type: type,
                            url: pathImage,
                            fileName: req.file.filename
                        });
                        return res.status(201).json({ banner: newBanner, mess: "Th??m m???i th??nh c??ng!" })
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
                                return res.status(200).json({ mess: "X??a th??nh c??ng!" })
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
                const { name } = req.body;
                const { idLink } = req.params;
                try {
                    const link = await Links.findOne({
                        where: {
                            id: idLink
                        }
                    })
                    if (link) {
                        const oldCate = await Categorys.findOne({
                            where: {
                                [Op.and]: [
                                    { name: name },
                                    { idLink: link.id }
                                ]
                            }
                        });
                        if (oldCate) {
                            return res.status(400).json({ error: "Category is already exist!" });
                        } else {
                            const newCate = await Categorys.create({
                                name: name,
                                idLink: link.id
                            });
                            return res.status(201).json({
                                Category: newCate,
                                mess: "Add successfully!"
                            })
                        }
                    } else {
                        return res.status(404).json({
                            error: "Link is already exist!"
                        })
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
                        return res.status(200).json({ mess: "X??a th??nh c??ng!" });
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
                        return res.status(200).json({ Cate: cate, mess: "C???p nh???t th??nh c??ng!" });
                    } else {
                        return res.status(400).json({ error: "Category not found!" })
                    }
                } catch (error) {
                    return res.status(500).json(error);
                }
            },
            GetAllCate: async (req, res) => {
                try {
                    const list = await Categorys.findAll({
                        include: { model: Links }
                    });
                    return res.status(200).json({ ListCate: list });
                } catch (error) {
                    return res.status(500).json(error);
                }
            },
        },
        Links: {
            AddLink: async (req, res) => {
                const { url } = req.body;
                try {
                    const oldLink = await Links.findOne({
                        where: {
                            url: url
                        }
                    });
                    if (oldLink) {
                        return res.status(400).json({ error: "Links is already exist!" });
                    } else {
                        const newLink = await Links.create({
                            url: url
                        });
                        return res.status(201).json({
                            Link: newLink,
                            mess: "Add successfully!"
                        })
                    }
                } catch (error) {
                    return res.status(500).json(error);
                }
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
                    const baseURL = req.protocol + '://' + req.get('host');
                    const pathImage = baseURL + '/public/images/' + req.file.filename;
                    const oldCompany = await Companys.findOne({
                        where: {
                            name: name
                        }
                    });
                    if (oldCompany) {
                        return res.status(400).json({ error: "Company is already exist!" })
                    } else {
                        const company = await Companys.create({
                            name: name,
                            website: website,
                            timeWorlk: timeWorlk,
                            hotline: hotline,
                            logo: pathImage
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
                const { name } = req.params;
                try {
                    const company = await Companys.findOne({
                        where: {
                            name: name
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
            Delete: async (req, res) => {
                const { id } = req.params;
                try {
                    const company = await Companys.findOne({
                        where: {
                            id: id
                        }
                    });
                    if (company) {
                        await Companys.destroy({
                            where: {
                                id: company.id
                            }
                        });
                        return res.status(200).json({ mess: "Delete success!" })
                    } else {
                        return res.status(404).json({ error: "Companys is already exist!" })
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