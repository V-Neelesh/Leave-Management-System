"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const models_1 = require("./models");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function setupDatabase() {
    try {
        console.log('Setting up database...');
        // Authenticate connection
        await models_1.sequelize.authenticate();
        console.log('Database connection established successfully.');
        // Sync all models
        await models_1.sequelize.sync({ force: true }); // Use force: true to recreate tables
        console.log('Database tables created successfully.');
        // Create test data
        console.log('Creating test data...');
        const hodPassword = await bcrypt_1.default.hash('hod123', 10);
        const studentPassword = await bcrypt_1.default.hash('student123', 10);
        const hod = await models_1.User.create({
            name: 'Dr. John Smith',
            email: 'hod@university.edu',
            password: hodPassword,
            role: 'hod',
        });
        const student = await models_1.User.create({
            name: 'John Doe',
            email: 'john.doe@university.edu',
            password: studentPassword,
            role: 'student',
        });
        await models_1.Leave.create({
            studentId: student.id,
            leaveType: 'Sick',
            startDate: '2026-01-10',
            endDate: '2026-01-12',
            reason: 'Fever',
            status: 'pending',
        });
        console.log('Test data created successfully!');
        console.log('\nTest Credentials:');
        console.log('HOD Login:');
        console.log('  Username: hod@university.edu');
        console.log('  Password: hod123');
        console.log('  Role: hod');
        console.log('\nStudent Login:');
        console.log('  Username: john.doe@university.edu');
        console.log('  Password: student123');
        console.log('  Role: student');
    }
    catch (error) {
        console.error('Error setting up database:', error);
    }
    finally {
        await models_1.sequelize.close();
    }
}
setupDatabase();
