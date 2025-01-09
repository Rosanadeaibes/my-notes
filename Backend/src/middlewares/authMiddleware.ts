import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { errorHandler } from '../utils/error';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
} // extends the Express Request interface globally to include an optional user property of type JwtPayload. This allows TypeScript to recognize req.user in the code.

export const protect = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(errorHandler(403, 'Access denied: invalid token format'));
    }
    //protect function intends to protect the middleware roots.
    // authHeader: Extracts the Authorization header from the incoming request.

    // Validation: Checks if the Authorization header is present and starts with "Bearer ". If not, it calls the error handler with a 403 status, indicating an invalid token format.

    const token = authHeader.split(' ')[1]; //token: Splits the Authorization header value by spaces and extracts the second part, which is the actual token.

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded as{userId: String}; // jwt.verify : it verifies the token using the env variable , if the token
        // is valid , it returns the payloaded payload
        // req.user: Assigns the decoded payload to req.user for use in subsequent middleware or route handlers.

        next(); // calls the next middleware function
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return next(errorHandler(401, 'Unauthorized: Token has expired'));
        }
        next(errorHandler(401, 'Unauthorized: Invalid token'));
    }
}; 
