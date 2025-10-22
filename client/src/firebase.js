// SIN JAPAN ONLINE SCHOOL - Firebase Configuration
// 教育プラットフォーム専用の新しいFirebaseプロジェクト
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration for SIN JAPAN ONLINE SCHOOL
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyACWkCVGsqeilFQgzazXzGIf1Cw_3Uu3NE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "school-ec82e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "school-ec82e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "school-ec82e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "415312790339",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:415312790339:web:3938fb482f78b4768525f6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MG8G98GS3G",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://school-ec82e-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Debug: Firebase設定を確認
console.log('🔥 Firebase Config (SIN JAPAN ONLINE SCHOOL):', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKeyLength: firebaseConfig.apiKey?.length
});

// Initialize Firebase Authentication
export const auth = getAuth(app);
console.log('✅ Firebase Auth initialized');

// Initialize Cloud Firestore
export const db = getFirestore(app);
console.log('✅ Firestore initialized');

// Initialize Firebase Storage
export const storage = getStorage(app);
console.log('✅ Firebase Storage initialized');

// Initialize Firebase Realtime Database
export const rtdb = getDatabase(app);
console.log('✅ Firebase Realtime Database initialized');

// Initialize Analytics (optional, only in production)
let analytics = null;
if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  analytics = getAnalytics(app);
  console.log('✅ Firebase Analytics initialized');
}

export { analytics };
export default app;
