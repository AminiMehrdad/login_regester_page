const User = require("./models/User");

(async function() {
    try {
        await User.sync({force : true});
    } catch (error) {
        console.error("Unabel to connect to the database:", error);
        process.exit(1)
    }
    
})();