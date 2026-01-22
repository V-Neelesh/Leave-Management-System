"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const leaves_1 = __importDefault(require("./routes/leaves"));
const models_1 = require("./models");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_NAME = process.env.DB_NAME || 'lms_db';
const DB_USER = process.env.DB_USER || 'root';
// Serve static files from project root public and compiled dist
app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
app.use('/dist', express_1.default.static(path_1.default.join(process.cwd(), 'dist')));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Auth route
app.use('/auth', auth_1.default);
app.use('/leaves', leaves_1.default);
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'public', 'login.html'));
});
// Test DB connection at server startup
models_1.sequelize.authenticate()
    .then(async () => {
    console.log('Database connection established successfully.');
    console.log('Database config', { host: DB_HOST, port: DB_PORT, name: DB_NAME, user: DB_USER, dialect: 'mysql' });
    await models_1.sequelize.sync();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
});
