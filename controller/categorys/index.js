const { Categorys, Links } = require("../../models");
const CategoryController = {
    GetAll: async (req, res) => {
        try {
            const list = await Categorys.findAll({
                include: [
                    {
                        model: Links
                    }
                ]
            });
            return res.status(200).json({ Categorys: list })
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

module.exports = {
    CategoryController
}