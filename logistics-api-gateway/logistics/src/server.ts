import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import http from "http";
import https from "https";
import fs from "fs";
import bodyParser from "body-parser";
import db from "./db";
import logisticRouter from "./controller/logistic-controller";
import healthCheckRouter from "./healthcheck";

dotenv.config();

// Middleware function for checking custom header
const checkCustomHeader = (req: Request, res: Response, next: NextFunction) => {
  const forwardedBy = req.headers["x-forwarded-by"];
  console.log("Forwarded by: ", forwardedBy);
  if (forwardedBy !== "API-Gateway") {
    return res.status(403).json({
      code: 403,
      status: "Error",
      message: "Forbidden: Direct access not allowed.",
      data: null,
    });
  }
  next();
};

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mount the health check router at '/healthcheck'
app.use('/healthcheck', healthCheckRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
app.use("/logistic", checkCustomHeader, logisticRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Load environment variables
const PORT: number = parseInt(process.env.PORT!) || 3000;

// Check if SSL is enabled
const isSSL: boolean = process.env.SSL_ENABLED === "true";

// Choose appropriate server based on SSL configuration
let server: http.Server | https.Server;
if (isSSL) {
  const privateKey: string = fs.readFileSync(
    process.env.SSL_PRIVATE_KEY_PATH!,
    "utf8"
  );
  const certificate: string = fs.readFileSync(
    process.env.SSL_CERTIFICATE_PATH!,
    "utf8"
  );
  const credentials: https.ServerOptions = {
    key: privateKey,
    cert: certificate,
  };
  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  db();
});




// Graceful shutdown logic
process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

function shutdown(signal: string) {
  console.log(`Received signal to terminate: ${signal}`);

  // Close the Express server gracefully
  server.close((err) => {
    if (err) {
      console.error("Error occurred during server shutdown:", err);
      process.exit(1); // Exit with failure code
    } else {
      console.log("Express server closed");
      process.exit(0); // Exit with success code
    }
  });
}