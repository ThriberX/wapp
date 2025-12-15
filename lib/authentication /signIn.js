import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
 const db = getFirestore();


auth.languageCode = 'en';


let appVerifier = null;

export function setuprecapcha() {
  if (typeof window === 'undefined') return;

  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container", 
    {
      size: "invisible",
      callback: () => {}
    }
  );

  appVerifier = window.recaptchaVerifier;
}

export  default async function sentotp(phoneNumber) {
  if (!appVerifier) {
    throw new Error("reCAPTCHA not initialized. Call setuprecapcha() first.");
  }  appVerifier = window.recaptchaVerifier;

  try {
    
    const confirmationResult =  signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    if (window.recaptchaWidgetId) {
      grecaptcha.reset(window.recaptchaWidgetId);
    }
    throw error;
  }
}

export function otpverifcation(code) {
  if (!window.confirmationResult) {
    throw new Error("OTP not sent yet.");
  }

  return window.confirmationResult
    .confirm(code)
    .then((result) => {
      const user = result.user;
      return user;
    })
    .catch((error) => {
      throw error;
    });
}


