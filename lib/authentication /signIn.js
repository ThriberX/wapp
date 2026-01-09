import { initializeApp, getApps } from 'firebase/app';
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

console.log("---------------------------------------------------");
console.log("DEBUG: FIREBASE API KEY BEFORE INIT IS:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Present" : "MISSING");
console.log("---------------------------------------------------");

// --- ADD THIS CHECK ---
// Only initialize if no apps exist AND we have an API key.
// This prevents the "invalid-api-key" crash during build if the key is missing.
let app;
if (getApps().length === 0) {
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    app = initializeApp(firebaseConfig);
  } else {
    // Determine if we are on the server (build time) or client
    if (typeof window !== "undefined") {
      console.error("Firebase API Key is missing!");
    }
  }
} else {
  app = getApps()[0];
}

console.log("---------------------------------------------------");
console.log("DEBUG: FIREBASE API KEY AFTER INIT IS:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("---------------------------------------------------");

export const auth = getAuth(app);
 export const db = getFirestore();


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

export  async function sentotp(phoneNumber) {
  if (!appVerifier) {
    throw new Error("reCAPTCHA not initialized. Call setuprecapcha() first.");
  }  

  try {
    
    const confirmationResult =  await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    if (window.recaptchaWidgetId) {
      grecaptcha.reset(window.recaptchaWidgetId);
    }
    throw error;
  }
}

export async function otpverifcation(code) {
  if (!window.confirmationResult) {
    throw new Error("OTP not sent yet.");
  }


  try{

  
  const result= await window.confirmationResult.confirm(code)

  return result.user;
  }catch(error)  {
      throw error;
    }
}


