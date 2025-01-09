import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Redux hook for dispatching actions
import { setAuthToken } from '../../redux/slices/authSlice'; // Redux slice for authentication
import { signIn } from './signin.services'; // Service to handle the sign-in API call
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const navigate = useNavigate(); // Hook to navigate between routes
    const dispatch = useDispatch(); // Hook to dispatch Redux actions

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault(); // Prevent form from reloading the page
        try {
            const data = await signIn(email, password); // Call the sign-in API
            dispatch(setAuthToken(data.token)); // Save token in Redux state
            alert('Logged in successfully!');
            navigate('/notescomponents'); // Navigate to notes page
        } catch (error) {
            console.error('Login failed:', error); 
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="container mx-auto w-full flex h-screen items-center justify-center bg-gray-50">
            {/* Card Component */}
            <Card className="w-full max-w-md shadow-md">
                {/* Card Header */}
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Sign In</CardTitle>
                    <CardDescription className="text-center text-gray-600">
                        Enter your credentials to access your account.
                    </CardDescription>
                </CardHeader>

                {/* Card Content */}
                <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // Update email state
                                className="mt-1 w-full"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Update password state
                                className="mt-1 w-full"
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <Button type="submit" className="w-full">
                                Sign In
                            </Button>
                        </div>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <a href="/signup" className="text-indigo-600 hover:underline">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignIn;
