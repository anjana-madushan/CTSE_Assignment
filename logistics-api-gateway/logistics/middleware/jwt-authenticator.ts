import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { getLogisticToken } from '../service/logistic-service'; // Assuming you have a function to check token in Logistic database

// Extend the Request interface to include a 'user' property
declare global {
    namespace Express {
      interface Request {
        token?: any;
      }
    }
  }

dotenv.config();

let JWT_SECRET: string = generateRandomSecret();

function generateRandomSecret(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Generate JWT token
const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '3h' });
};

// Verify JWT token
const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Middleware to authenticate JWT token
const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader: string | undefined = req.headers['authorization'];
    const token: string | undefined = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      res.sendStatus(401); // Unauthorized
      return;
    }
  
    // Check if token is available in Logistic database
    const isValidToken = await getLogisticToken(token);
    if (!isValidToken) {
      res.sendStatus(403); // Forbidden
      return;
    }
  
    const decoded = verifyToken(token);
    if (!decoded) {
      res.sendStatus(403); // Forbidden
      return;
    }
  
    req.token = decoded;
    next();
  };
  

export { generateToken, authenticateToken };
