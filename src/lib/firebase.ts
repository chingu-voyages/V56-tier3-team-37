// Firebase configuration - COMMENTED OUT FOR SKELETON
// To use Firebase, you need to:
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Enable Authentication with Email/Password provider
// 3. Get your config from Project Settings
// 4. Create .env.local with your Firebase config
// 5. Uncomment this code

/*
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
}

const app = !getApps().length
    ? initializeApp(config)
    : getApp()

export const auth = getAuth(app)
export const db = getFirestore(app)
*/

// Mock exports for skeleton app
export const auth = null as any;
export const db = null as any;
