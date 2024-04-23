import express, { Request, Response } from "express";
import formatter from "./utils/timeDuration";

const router = express.Router();

// Health Check Endpoint
router.get("/", (_req: Request, res: Response) => {

  // Calculate server uptime in milliseconds
  const uptimeMs = process.uptime() * 1000;
  const upTime = formatter(uptimeMs);

  res.status(200).json({
    code: 200,
    status: "Success",
    message: "Health check passed succesfully.",
    upTime: upTime,
  });
});

export default router;
