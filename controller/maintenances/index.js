const { Maintenances } = require("../../models")
const MaintenanceController = {
    Add: async (req, res) => {
        try {
            const oldMaintenances = await Maintenances.findOne();
            if (oldMaintenances) {
                return res.status(400).json({ error: "Maintenance is already exist!" })
            } else {
                const newMaintenances = await Maintenances.create({ on: true });
                return res.status(201).json({ Maintenance: newMaintenances, mess: "Add successfully!" })
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    Edit: async (req, res) => {
        const { status } = req.params;
        try {
            const maintenances = await Maintenances.findOne();
            maintenances.on = status;
            await maintenances.save();
            return res.status(200).json({ mess: "Update success!" })
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    CheckMaintenance: async (req, res) => {
        try {
            const Maintenance = await Maintenances.findOne();
            if (Maintenance) {
                return res.status(200).json({ Maintenance: Maintenance })
            } else {
                return res.status(404).json({ error: "Maintenance is not exit!" })
            }
        } catch (error) {
            return res.status(500).json(error);
        }
    }
};

module.exports = {
    MaintenanceController
}