"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const login = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        // Validate input
        if (!username || !password || !role) {
            res.status(400).json({
                success: false,
                message: 'Username, password, and role are required'
            });
            return;
        }
        const userRecord = await models_1.User.findOne({
            where: {
                role,
                // allow login by email or name
            },
        });
        // try email first
        let found = userRecord;
        if (!found) {
            found = await models_1.User.findOne({ where: { email: username, role } });
        }
        if (!found) {
            found = await models_1.User.findOne({ where: { name: username, role } });
        }
        if (!found) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        // Verify password using bcrypt
        const isPasswordValid = await bcrypt_1.default.compare(password, found.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            id: found.id,
            username: found.name,
            role: found.role
        }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        // Prepare response
        const response = {
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: found.id,
                username: found.name,
                role: found.role,
                name: found.name
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.login = login;
