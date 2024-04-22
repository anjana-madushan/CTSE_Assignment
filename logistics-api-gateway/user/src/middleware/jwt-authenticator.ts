// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";


// // Extend the Request interface to include a 'user' property
// declare global {
//   namespace Express {
//     interface Request {
//       token?: any;
//     }
//   }
// }

// dotenv.config();

// let JWT_SECRET: string = generateRandomSecret();

// function generateRandomSecret(): string {
//   return (
//     Math.random().toString(36).substring(2, 15) +
//     Math.random().toString(36).substring(2, 15)
//   );
// }

// // Generate JWT token
// const generateToken = (payload: any): string => {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: "3h" });
// };

// // Generate JWT token without payload
// const generateTokenNoPayload = (): string => {
//     return jwt.sign({}, JWT_SECRET, { expiresIn: '3h' });
//   };

// // Verify JWT token
// const verifyToken = (token: string): any => {
//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch (error) {
//     return null;
//   }
// };

// // Middleware to authenticate JWT token
// const authenticateToken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const authHeader: string | undefined = req.headers["authorization"];
//   const token: string | undefined = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     res.sendStatus(401); // Unauthorized
//     return;
//   }

//   // Check if token is available in Logistic database
//   const isValidToken = await getLogisticToken(token);
//   if (!isValidToken) {
//     res.sendStatus(403); // Forbidden
//     return;
//   }

//   const decoded = verifyToken(token);
//   if (!decoded) {
//     res.sendStatus(403); // Forbidden
//     return;
//   }

//   req.token = decoded;
//   next();
// };

// // Function to update token in Logistics database every 3 hours
// const updateTokenPeriodically = (): void => {
//   setInterval(async () => {
//     const token = generateTokenNoPayload();
//     await updateLogisticToken(token);
//   }, 3 * 60 * 60 * 1000); // 3 hours in milliseconds
// };

// // Start updating token periodically
// updateTokenPeriodically();

// export { generateToken, authenticateToken };