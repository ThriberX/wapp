import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_WAPP,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_WAPP,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_WAPP,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_WAPP,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_WAPP,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_WAPP
};

const appName = 'wapp-quiz';
const app = !getApps().some(existingApp => existingApp.name === appName)
  ? initializeApp(firebaseConfig, appName)
  : getApps().find(existingApp => existingApp.name === appName);

export const db = getFirestore(app);

export default app;