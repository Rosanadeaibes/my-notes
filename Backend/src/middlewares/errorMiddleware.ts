import { Request, Response, NextFunction } from 'express';


interface CustomError extends Error {
    statusCode?: number;
}
//CustomError Interface: This interface extends the built-in Error interface and adds an optional statusCode property.
// This is useful for handling errors that carry an HTTP status code

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode || 500; // it check if err has the status code value , if not it gives 500(internal server error)
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ //sets the HTTP response status to statuscode and sends a
        statusCode, // jJSON response containing the statuscode and the message.
        message,
    });
};

export default errorMiddleware;