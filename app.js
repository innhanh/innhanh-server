const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const cors = require("cors");
const { rootRouter } = require("./router");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')))



app.use("/api/v1", rootRouter)

app.get("/", (req, res) => {
    return res.status(200).json({ mess: "Wellcome!" })
});

const { sequelize } = require("./models");

const CheckDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
CheckDatabase();

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
});

