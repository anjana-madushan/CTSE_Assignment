import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import https from "https";
import fs from "fs";
import db from "./db";

dotenv.config();

const app = express();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// Load environment variables
const PORT: number = parseInt(process.env.PORT!) || 3000;

// Check if SSL is enabled
const isSSL: boolean = process.env.SSL_ENABLED === "true";

// Choose appropriate server based on SSL configuration
let server: http.Server | https.Server;
if (isSSL) {
  const privateKey: string = fs.readFileSync(process.env.SSL_PRIVATE_KEY_PATH!, "utf8");
  const certificate: string = fs.readFileSync(process.env.SSL_CERTIFICATE_PATH!, "utf8");
  const credentials: https.ServerOptions = { key: privateKey, cert: certificate };
  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  db();
});
