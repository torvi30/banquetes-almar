import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Firebase Client SDK Configuration for Banquetes Almar.
 * Credentials and settings are loaded dynamically from environment variables.
 */

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || "",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || ""
};

export const isFirebaseConfigured = () => {
  return typeof firebaseConfig.apiKey === "string" && firebaseConfig.apiKey.length > 10;
};

// Initialize Firebase App instance
export const app = isFirebaseConfigured()
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

// Export initialized Firestore and Auth instances
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
