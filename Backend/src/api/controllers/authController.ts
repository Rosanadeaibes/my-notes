import bcrypt from 'bcryptjs'; // For hashing passwords
import Jwt, {TokenExpiredError} from 'jsonwebtoken'; // For generating and verifying tokens
import { PrismaClient } from '@prisma/client'; // Prisma client for database interaction
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { errorHandler } from '../../utils/error';
import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken';

// Initialize Prisma Client
const prisma = new PrismaClient();

//Sign Up Function
export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return next(errorHandler(400, errors.array().map(err => err.msg)));
  } // validate the request data and returns an error if validation fails

  const { email, password } = req.body;
  //extract email and password from the request body 

  try {
      const userExists = await prisma.user.findUnique({
          where: { email }
      });

      if (userExists) {
          return next(errorHandler(400, 'User already exists'));
      }
      //check if user exists

      const hashedPassword = await bcrypt.hash(password, 10);
      //hashes the user's password using bcrypt 

      const user = await prisma.user.create({
          data: {
              email,
              password: hashedPassword
          }
      });
      //creates a new user in the database with the hashed password

      res.status(201).json({
          statusCode: "201",
          message: "User created",
          data: {
              id: user.id,
              email: user.email,
          }
      });
      // sends a JSOn response with a status code of 201 indicating creating

  } catch (error: unknown) {
      next(error instanceof Error
          ? errorHandler(500, `Internal Server Error, ${error.message}`)
          : errorHandler(500, 'An unknown error occurred'));
  }
}; //catches any errors and calls the error handler


//Signin function 
export const signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return next(errorHandler(400, errors.array().map(err => err.msg)));
  }

  const { email, password } = req.body;

  try {
      const user = await prisma.user.findUnique({
          where: { email }
      }); // queries the database for a user with the provided email 

      if (!user || !(await bcrypt.compare(password, user.password))) {
          return next(errorHandler(401, 'Invalid credentials'));
      } //compares the provided password with the stored hashed password using bcrypt

      const accessToken = generateAccessToken(user.id.toString());
      const refreshToken = generateRefreshToken(user.id.toString());
    // generate access and refresh tokens for the user
      res.json({
          statusCode: "200",    
          message: "Sign in successful",
          data: {
              id: user.id,
              email: user.email,
              accessToken,
              refreshToken
          }
      }); //sends a JSON response with the user details and tokens

  } catch (error: unknown) {
      next(error instanceof Error
          ? errorHandler(500, `Internal Server Error, ${error.message}`)
          : errorHandler(500, 'An unknown error occurred'));
  }
}; // error handling


//refresh access token function 
export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return next(errorHandler(400, errors.array().map(err => err.msg)));
  } // extract refreshToken from the request body

  const { refreshToken } = req.body;

  if (!refreshToken) {
      return next(errorHandler(400, 'Refresh token is required'));
  }

  if (typeof refreshToken !== 'string') {
      return next(errorHandler(400, 'Invalid refresh token'));
  } // ensures that the refresh token is provided and is a string 

  try {
      const decoded = Jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as Jwt.JwtPayload;
      const newAccessToken = generateAccessToken(decoded.userId);
//generates a new access token using the user ID from the decoded refresh token
      res.status(200).json({
          accessToken: newAccessToken,
      }); //sends a JSON response with the new access token

  } catch (error) {
      if (error instanceof TokenExpiredError) {
          return next(errorHandler(401, 'Unauthorized: Refresh token has expired'));
      }
      next(errorHandler(401, 'Unauthorized: Invalid token'));
  }
};
