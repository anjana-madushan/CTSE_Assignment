import express, { Request, Response } from "express";
import formatter from "./utils/timeDuration";
import db from "./db";

const router = express.Router();

// Health Check Endpoint
router.get("/", async (_req: Request, res: Response) => {
  try {
    // Connect to MongoDB using the exported function from db.ts
    const mongooseConnection = await db();

    // Calculate server uptime in milliseconds
    const uptimeMs = process.uptime() * 1000;
    const upTime = formatter(uptimeMs);

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Health check passed.",
      upTime: upTime,
      data: {
        mongodb: "Connected"
      }
    });
  } catch (error: any) {
    console.error("Health Check Error:", error);

    // Check if the error is an instance of Error to access the message property
    if (error instanceof Error) {
      res.status(500).json({
        code: 500,
        status: "Error",
        message: "Health check failed.",
        error: error.message
      });
    } else {
      // Fallback response if error type cannot be determined
      res.status(500).json({
        code: 500,
        status: "Error",
        message: "Health check failed.",
        error: "Unknown error occurred"
      });
    }
  }
});

export default router;
