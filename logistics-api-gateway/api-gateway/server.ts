import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import axios from "axios";

//TODO: @Pasan - If the hosting plan doesnt support https use certbot to get a free ssl certificate

interface Service {
  req: any;
  res: any;
  next: any;
}

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
const rateLimit = 80; // Max requests per minute
const interval = 60 * 8000; // Time window in milliseconds (8 minute)

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

// Middleware to check the token
export async function CheckAuth(req: any, res: any, next: any) {
  const cookie = req.headers.cookie.split(' ')[1];
  const token = req.headers["x-auth-token"];
  console.log("cookie", cookie)
  console.log("token", token)
  if (cookie) {
    try {
      // Send API call to check the token
      const response = await axios.post(
        "http://localhost:5040/user/checkToken",
        {},
        {
          headers: {
            cookie: cookie,
            "x-forwarded-by": "API-Gateway",
            "x-auth-token": token,

          }
        }
      );

      // If token is valid (status 200), continue to the next middleware
      if (response.status === 200) {
        return next();
      } else {
        // If token is invalid (status 403), respond with an error
        return res.status(403).json({
          code: 403,
          status: "Error",
          message: "Token is invalid.",
          data: null,
        });
      }
    } catch (error) {
      // console.error(error);
      // If an error occurs during the API call, respond with an error
      return res.status(500).json({
        code: 500,
        status: "Error",
        message: "Internal server error.",
        data: null,
      });
    }
  } else {
    return res.status(400).json({
      code: 400,
      status: "Error",
      message: "Token is missing.",
      data: null,
    });
  }
}

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

  if (!route.endsWith("/user")) {
    console.log("route", route.includes("/login"));
    // If the route doesn't end with /user/login, apply CheckAuth middleware
    app.use(
      route,
      CheckAuth,
      rateLimitAndTimeout,
      createProxyMiddleware(proxyOptions)
    );
  } else {
    // If the route ends with /user/login, only apply rate limiting and timeout middleware
    app.use(
      route,
      rateLimitAndTimeout,
      createProxyMiddleware(proxyOptions)
    );
  }
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
