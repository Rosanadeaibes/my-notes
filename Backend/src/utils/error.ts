/**
 * Custom error handler function
 * 
//  * param statusCode - HTTP status code
//  * param message - Error message or array of error messages
//  * returns Configured Error object
 */
export const errorHandler = (statusCode: number, message: string | string[]) => {
    // Normalize the message to always be an array
    const errorMessage = Array.isArray(message) ? message : [message];

    // Create a new Error object with a concatenated message string
    const error: any = new Error(errorMessage.join(', '));

    // Assign the status code to the error object
    error.statusCode = statusCode;

    // Assign the message property to either a single message or the array of messages
    error.message = errorMessage.length === 1 ? errorMessage[0] : errorMessage;

    // Return the configured Error object
    return error;
};
