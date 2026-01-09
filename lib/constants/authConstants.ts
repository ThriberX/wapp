export const VALIDATION_REGEX = {
  PHONE: /^\+?[1-9]\d{6,14}$/,
} as const;

export const VALIDATION_RULES = {
  OTP_LENGTH: 6,
} as const;

export const TIMEOUTS = {
  SUCCESS_REDIRECT: 800,
  SUCCESS_MESSAGE: 3000,
} as const;

export const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-phone-number': 'Invalid phone number format. Please use +[country code][number]',
  'auth/missing-phone-number': 'Please enter a phone number',
  'auth/quota-exceeded': 'Too many requests. Please try again later',
  'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again',
  'auth/invalid-app-credential': 'Phone authentication not properly configured. Please contact support',
  'auth/web-storage-unsupported': 'Your browser does not support required features',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later',
  'auth/network-request-failed': 'Network error. Please check your internet connection',
  'auth/invalid-verification-code': 'Invalid OTP. Please try again',
  'auth/code-expired': 'OTP has expired. Please request a new one',
} as const;

export const UI_MESSAGES = {
  
  LOGIN_SUCCESS: 'Login successful! Welcome back!',
  SIGNUP_SUCCESS: 'Signup successful! Redirecting...',
  PHONE_VERIFIED_SUCCESS: 'Phone number verified successfully!',
  OTP_SENT_SUCCESS: 'OTP sent to your phone number!',

  INVALID_PHONE: 'Please enter a valid phone number with country code (e.g., +91 XXXXXXXXXX)',
  INVALID_OTP: 'Please enter a valid 6-digit OTP',
  OTP_NOT_INITIALIZED: 'OTP process not initialized. Please resend OTP',
  RECAPTCHA_FAILED: 'reCAPTCHA initialization failed. Please try again',
  LOGIN_FAILED: 'Login failed. Please try again',
  SIGNUP_FAILED: 'Failed to create account. Please try again',
  OTP_SEND_FAILED: 'Failed to send OTP. Please check your phone number and try again',
  OTP_VERIFY_FAILED: 'Invalid OTP. Please try again',
  UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again',
} as const;

export const PLACEHOLDERS = {
  PHONE: '+91 XXXXXXXXXX',
  OTP: 'Enter 6-digit OTP',
} as const;