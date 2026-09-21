/**
 * Firebase Client SDK Configuration for Banquetes Almar.
 * Credentials and settings are loaded dynamically from environment variables.
 */

import { ENV } from "./env.js";

export const firebaseConfig = {
  apiKey: ENV?.FIREBASE_API_KEY || "",
  authDomain: ENV?.FIREBASE_AUTH_DOMAIN || "",
  projectId: ENV?.FIREBASE_PROJECT_ID || "",
  storageBucket: ENV?.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: ENV?.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: ENV?.FIREBASE_APP_ID || "",
  measurementId: ENV?.FIREBASE_MEASUREMENT_ID || ""
};

export const isFirebaseConfigured = () => {
  return typeof firebaseConfig.apiKey === "string" && firebaseConfig.apiKey.length > 10;
};
