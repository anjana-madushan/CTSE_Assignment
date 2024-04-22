import { Request, Response, NextFunction } from "express";
// Custom middleware to restrict access to forwarded requests from the API Gateway
function restrictAccess(req: Request, res: Response, next: NextFunction) {
    const forwardedHost = req.headers["x-forwarded-host"];
    const gatewayHost = "localhost:5010"; // The host of the API Gateway
  
    if (forwardedHost !== gatewayHost) {
      return res.status(403).json({
        message: "Forbidden",
        error: "Access denied. Requests must be forwarded from the API Gateway."
      });
    }
  
    next();
  }
  