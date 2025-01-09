import express from 'express';
import { refreshAccessTokenValidation, signinValidation, signupValidation } from '../validators/authValidator';
import { refreshAccessToken, signIn, signUp } from '../api/controllers/authController';


const router = express.Router();

router.post('/signup', signupValidation(), signUp);
router.post("/signin",signinValidation(),signIn);
router.post("/refresh-token",refreshAccessTokenValidation(),refreshAccessToken)

export default router;