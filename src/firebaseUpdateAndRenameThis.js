// Update this file with your firebase settings and rename to firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
const {
  initializeAppCheck,
  ReCaptchaV3Provider,
} = require("firebase/app-check");

const firebaseConfig = {
  apiKey: "#######################",
  authDomain: "#######################",
  projectId: "#######################",
  storageBucket: "#######################",
  messagingSenderId: "#######################",
  appId: "#######################",
  measurementId: "#######################",
};

const app = initializeApp(firebaseConfig);

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("#######################"),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
