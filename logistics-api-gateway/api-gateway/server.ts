import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

//TODO: @Pasan - If the hosting plan doesnt support https use certbot to get a free ssl certificate

//Function for custom header
function addCustomHeader(req: any, _res: any, next: any) {
  req.headers["X-Forwarded-By"] = "API-Gateway";
  next();
}

const app = express();

// Middleware setup
app.use(cors());
app.use(helmet()); 
app.use(morgan("combined")); 
app.disable("x-powered-by"); 
app.use(addCustomHeader); // Apply the custom header middleware to the proxy


// Define rate limit constants
//TODO @Pasan - Change the rate limit to based on hosting plan
const rateLimit = 20; // Max requests per minute
const interval = 60 * 1000; // Time window in milliseconds (1 minute)

// Object to store request counts for each IP address
const requestCounts: { [key: string]: number } = {};

// Reset request count for each IP address every 'interval' milliseconds
setInterval(() => {
  Object.keys(requestCounts).forEach((ip) => {
    requestCounts[ip] = 0; // Reset request count for each IP address
  });
}, interval);

// Middleware function for rate limiting and timeout handling
function rateLimitAndTimeout(req: any, res: any, next: any) {
  const ip = req.ip; // Get client IP address

  // Update request count for the current IP
  requestCounts[ip] = (requestCounts[ip] || 0) + 1;

  // Check if request count exceeds the rate limit
  if (requestCounts[ip] > rateLimit) {
    // Respond with a 429 Too Many Requests status code
    return res.status(429).json({
      code: 429,
      status: "Error",
      message: "Rate limit exceeded.",
      data: null,
    });
  }

  // Set timeout for each request (example: 10 seconds)
  req.setTimeout(15000, () => {
    // Handle timeout error
    res.status(504).json({
      code: 504,
      status: "Error",
      message: "Gateway timeout.",
      data: null,
    });
    req.abort(); // Abort the request
  });

  next(); // Continue to the next middleware
}

// Apply the rate limit and timeout middleware to the proxy
app.use(rateLimitAndTimeout);



// Define routes and corresponding microservices
const services = [
  {
    route: "/user",
    target: "http://localhost:5040/user", //TODO @Pasan - Replace this base url  with the hosted one
    header: "API-Gateway",
  },
  {
    route: "/logistics",
    target: "http://localhost:5050/logistic", //TODO @Pasan - Replace this base url  with the hosted one
    header: "API-Gateway",
  },
];

// Set up proxy middleware for each microservice optional
services.forEach(({ route, target }) => {
  // Proxy options
  const proxyOptions = {
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: "",
    },
  };

  // Apply rate limiting and timeout middleware before proxying
  app.use(route, rateLimitAndTimeout, createProxyMiddleware(proxyOptions));
});

// Handler for route-not-found
app.use((_req, res) => {
  res.status(404).json({
    code: 404,
    status: "Error",
    message: "Route not found.",
    data: null,
  });
});

// Define port for Express server
const PORT = process.env.PORT || 5010;

// Start Express server
app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});
