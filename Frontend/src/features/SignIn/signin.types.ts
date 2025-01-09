export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface SignInResponse {
    token: string; // accessToken
    refreshToken: string; // refreshToken
    user?: User; // User details (optional)
}
