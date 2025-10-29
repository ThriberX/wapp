// Regex patterns
export const VALIDATION_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{6,14}$/,
} as const;

// Validation rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  OTP_LENGTH: 6,
} as const;

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  SUCCESS_REDIRECT: 800,
  SUCCESS_MESSAGE: 3000,
} as const;

// Firebase error messages mapping
export const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  // Login errors
  'auth/invalid-email': 'Invalid email or password. Please check your credentials.',
  'auth/user-not-found': 'Invalid email or password. Please check your credentials.',
  'auth/wrong-password': 'Invalid email or password. Please check your credentials.',
  'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
  'auth/user-disabled': 'This user account has been disabled.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your internet connection.',
  
  // Signup errors
  'auth/email-already-in-use': 'This email address is already registered.',
  'auth/weak-password': 'Password is too weak. Must be at least 6 characters.',
} as const;

// UI Messages
export const UI_MESSAGES = {
  // Success messages
  LOGIN_SUCCESS: 'Login successful! Welcome back!',
  SIGNUP_SUCCESS: 'Account created successfully! Please check your email for the verification link before logging in.',
  EMAIL_VERIFIED_SUCCESS: 'Email verified! Login successful!',
  EMAIL_VERIFICATION_SENT: 'Verification email sent! Please check your inbox.',
  EMAIL_VERIFICATION_RESENT: 'Verification email re-sent! Please check your inbox.',
  PHONE_VERIFIED_SUCCESS: 'Phone number verified successfully!',
  OTP_SENT_SUCCESS: 'OTP sent to your phone number!',
  
  // Error messages
  INVALID_EMAIL: 'Please enter a valid email address (e.g. user@example.com)',
  INVALID_PHONE: 'Please enter a valid phone number with country code (e.g., +91 XXXXXXXXXX)',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  PASSWORDS_MISMATCH: 'Passwords do not match.',
  NAME_TOO_SHORT: 'Please enter your full name (at least 2 characters)',
  PHONE_NOT_VERIFIED: 'Please verify your phone number first.',
  INVALID_OTP: 'Please enter a valid 6-digit OTP',
  OTP_NOT_INITIALIZED: 'OTP process not initialized. Please resend OTP.',
  RECAPTCHA_FAILED: 'reCAPTCHA initialization failed. Please try again.',
  EMAIL_NOT_VERIFIED: 'Email is still not verified. Please check your inbox and click the verification link.',
  VERIFICATION_RESEND_FAILED: 'Failed to resend verification email. Please try again.',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  SIGNUP_FAILED: 'Failed to create account. Please try again.',
  OTP_SEND_FAILED: 'Failed to send OTP. Please check your phone number and ensure reCAPTCHA is working.',
  OTP_VERIFY_FAILED: 'Invalid OTP. Please try again.',
  UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Placeholder text
export const PLACEHOLDERS = {
  PHONE: '+91 XXXXXXXXXX',
  OTP: 'Enter 6-digit OTP',
} as const;