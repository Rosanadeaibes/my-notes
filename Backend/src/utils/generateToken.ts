import jwt from 'jsonwebtoken';

// Import jwt from the jsonwebtoken package to handle JWT creation and verification.

interface Payload {
    userId: string;
}
// Payload Interface: This defines a TypeScript interface named Payload with a single property userId of type string. 
// This interface represents the shape of the data that will be included in the payload of the JWT.

export const generateAccessToken = (userId: string): string => {
    const payload: Payload = { userId };
    // This creates an object payload that adheres to the Payload interface.
    // It includes the userId property with the value passed to the function.

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    // Ensures that the secret key for signing the token is defined to avoid runtime errors.

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '15m',
        algorithm: 'HS256',
    });
    // This line calls jwt.sign to create a new JWT. The sign function takes four arguments:
    // payload: The data to include in the token, which is the userId.
    // process.env.JWT_SECRET: The secret key used to sign the token. This value is retrieved from an environment variable named JWT_SECRET.
    // An options object specifying expiresIn: '15m', which sets the token's expiration time to 15 minutes.
    // algorithm: Specifies the signing algorithm, in this case, HS256.

    return accessToken;
};

export const generateRefreshToken = (userId: string): string => {
    const payload: Payload = { userId };
    // This creates an object payload that adheres to the Payload interface.
    // It includes the userId property with the value passed to the function.

    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables.");
    }
    // Ensures that the secret key for signing the refresh token is defined to avoid runtime errors.

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '5h',
        algorithm: 'HS256',
    });
    // This line calls jwt.sign to create a new JWT. The sign function takes four arguments:
    // payload: The data to include in the token, which is the userId.
    // process.env.JWT_REFRESH_SECRET: The secret key used to sign the token. This value is retrieved from an environment variable named JWT_REFRESH_SECRET.
    // An options object specifying expiresIn: '5h', which sets the token's expiration time to 5 hours.
    // algorithm: Specifies the signing algorithm, in this case, HS256.

    return refreshToken;
};

// Payload Interface: Defines the structure of the payload included in the tokens.
// generateAccessToken: Creates an access token that expires in 15 minutes.
// generateRefreshToken: Creates a refresh token that expires in 5 hours.
