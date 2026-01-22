import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import leavesRoutes from './routes/leaves';
import { authenticateToken } from './middleware/auth';
import { sequelize } from './models';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_NAME = process.env.DB_NAME || 'lms_db';
const DB_USER = process.env.DB_USER || 'root';

// Serve static files from project root public and compiled dist
app.use(express.static(path.join(process.cwd(), 'public')));
app.use('/dist', express.static(path.join(process.cwd(), 'dist')));

app.use(cors());
app.use(express.json());

// Auth route
app.use('/auth', authRoutes);

app.use('/leaves', leavesRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
});

// Test DB connection at server startup
sequelize.authenticate()
    .then(async () => {
        console.log('Database connection established successfully.');
        console.log('Database config', { host: DB_HOST, port: DB_PORT, name: DB_NAME, user: DB_USER, dialect: 'mysql' });
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    process.exit(1);
});
