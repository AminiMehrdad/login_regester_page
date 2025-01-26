const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Dashbord", "root", "Mehrdad@1010", {
    host: "localhost",
    dialect: "mysql"
});

(async function () {
    try {
        await sequelize.authenticate()
        console.log("we connect to DB");
    } catch (error) {
        console.error("unabel to connet DB", error);
        process.exit();
    }
})()

module.exports = sequelize;