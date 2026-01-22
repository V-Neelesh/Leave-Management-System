"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
(async () => {
    try {
        await index_1.sequelize.authenticate();
        await index_1.sequelize.sync({ alter: true });
        console.log('Database & tables synced!');
    }
    catch (err) {
        console.error('Unable to sync database:', err);
    }
    finally {
        await index_1.sequelize.close();
    }
})();
