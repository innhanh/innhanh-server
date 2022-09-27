const { Images } = require("../../models")

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
    }
};

module.exports = {
    ImageController
}