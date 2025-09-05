// Centralized API endpoints for the frontend
// Usage: import { API } from './api';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const API = {
  LOGIN: `${BASE_URL}/user/login`,
  REGISTER: `${BASE_URL}/user/register`,
  LOGOUT: `${BASE_URL}/user/logout`,
  AUTH_ME: `${BASE_URL}/auth/me`,
  GOOGLE_AUTH: `${BASE_URL}/auth/google`,
  FORGOT_PASSWORD: `${BASE_URL}/user/forgot-password`,
  VERIFY_OTP: (email) => `${BASE_URL}/user/verify-otp/${email}`,
  CHANGE_PASSWORD: (email) => `${BASE_URL}/user/change-password/${email}`,
  VERIFY_EMAIL: `${BASE_URL}/user/verify`,
  // Add more endpoints as needed
};
