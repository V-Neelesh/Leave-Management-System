import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models';

interface LoginRequest {
  username: string;
  password: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    username: string;
    role: string;
    name?: string;
  };
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role }: LoginRequest = req.body;

    // Validate input
    if (!username || !password || !role) {
      res.status(400).json({
        success: false,
        message: 'Username, password, and role are required'
      });
      return;
    }

    const userRecord = await User.findOne({
      where: {
        role,
        // allow login by email or name
      },
    });
    // try email first
    let found = userRecord;
    if (!found) {
      found = await User.findOne({ where: { email: username, role } });
    }
    if (!found) {
      found = await User.findOne({ where: { name: username, role } });
    }

    if (!found) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, found.password);
    
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: found.id,
        username: found.name,
        role: found.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Prepare response
    const response: LoginResponse = {
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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
