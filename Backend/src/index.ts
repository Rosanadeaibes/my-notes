import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import authRoutes from './routes/authRoutes';
import notesRoutes from './routes/notesRoutes';

dotenv.config();

const app = express(); //initialize express app 

app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
}));
app.use(express.json()); // parses incoming JSON requests and puts the parsed data in req.body

const port = process.env.PORT || 4000; // retrieves the port number from the enviroment variables
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); // start the server 

// const version = process.env.API_VERSION!; //retrieves the API version from the env variables 
// const baseUrl = `${process.env.BASE_URL!}/${version}`; //constructs the base URL for the API 

app.use("/auth", authRoutes); // mounts the auth routes
app.use("/note", notesRoutes);

// app.use(errorMiddleware);//adds the error handling middleware to handle errors in the application





