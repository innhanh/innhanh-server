const { Images, Avatas, Users } = require("../../models");
const { ManagerUsersRouter } = require("../../router/admin/manager/users");

const ImageController = {
    GetImages: async (req, res) => {
        const { type } = req.params;
        try {
            const list = await Images.findAll({
                where: {
                    type: type
                }
            });
            return res.status(200).json({ images: list })
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    GetAvatar: async (req, res) => {
        const { idUser } = req.params;
        try {
            const user = await ManagerUsersRouter.findOne({
                where: {
                    id: idUser
                }
            });
            if (user) {
                const avatar = await Avatas.findOne({
                    where: {
                        idUser: idUser
                    }
                });
                return res.status(200).json({ avatar: avatar })
            } else {
                return res.status(404).json({ error: "Admin is not exit!" })
            }
        } catch (error) {
            return res.status(500).json(error)
        }
    }
};

module.exports = {
    ImageController
}