
import api from '@/api/base';
import { SignInResponse } from './signin.types';

// Sign-In function to authenticate a user
export const signIn = async (email: string, password: string): Promise<SignInResponse> => {
    try {
        const response = await api.post('/auth/signin', { email, password });
        return response.data as SignInResponse; 
    } catch (error) {
        console.error('Sign-in failed:', error);
        throw error; 
    }
};
