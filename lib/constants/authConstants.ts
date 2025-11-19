export const VALIDATION_REGEX = {
  PHONE: /^\+?[1-9]\d{6,14}$/,
} as const;

export const TIMEOUTS = {
  SUCCESS_REDIRECT: 800,
} as const;

export const UI_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Welcome back!',
  SIGNUP_SUCCESS: 'Signup successful! Redirecting...',
  OTP_SENT_SUCCESS: 'OTP sent to your phone number!',
  
  INVALID_PHONE: 'Please enter a valid phone number with country code (e.g., +91 XXXXXXXXXX)',
  OTP_NOT_INITIALIZED: 'OTP process not initialized. Please resend OTP',
  RECAPTCHA_FAILED: 'reCAPTCHA initialization failed. Please try again',
  OTP_SEND_FAILED: 'Failed to send OTP. Please check your phone number and try again',
  OTP_VERIFY_FAILED: 'Invalid OTP. Please try again',
} as const;

export const PLACEHOLDERS = {
  PHONE: '+91 XXXXXXXXXX',
  OTP: 'Enter 6-digit OTP',
} as const;