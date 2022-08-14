const { Users } = require("../../models");

const userController = {
    Authen: {
        Login: async (req, res) => {
            const { userName, pass } = req.body;
            try {

            } catch (error) {
                return res.status(500).json(error)
            }
        },
        Logout: async (req, res) => {
            try {

            } catch (error) {
                return res.status(500).json(error)
            }
        }
    }
};

module.exports = {
    userController
}