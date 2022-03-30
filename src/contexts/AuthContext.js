import React, { useContext, useState, useEffect } from "react";
import { auth } from "./../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { db } from "./../firebase";
import { doc, setDoc } from "firebase/firestore/lite";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password, displayName) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(errorCode, errorMessage);
      });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  function logout() {
    signOut(auth);
  }

  function resetPassword(email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  function updateEmailAdress(email) {
    const user = auth.currentUser;
    const newEmail = email;

    updateEmail(user, newEmail)
      .then(() => {
        // Update successful.
      })
      .catch((error) => {
        // An error ocurred
        // ...
      });
  }

  async function updateDisplayName(displayNameArg) {
    const user = auth.currentUser;
    const newDisplayName = displayNameArg;

    await addDisplayNameToDB(user, newDisplayName);

    updateProfile(user, { displayName: newDisplayName })
      .then(() => {
        // Update successful.
      })
      .catch((error) => {
        // An error ocurred
        // ...
      });
  }

  async function addDisplayNameToDB(user, newDisplayName) {
    await setDoc(doc(db, "userDisplayNames", user.uid), {
      user: user.uid,
      displayName: newDisplayName,
    });

    console.log("hallo");
    // upsert user name in data base for users.
  }

  function updatePasswordTxt(password) {
    const user = auth.currentUser;
    const newPassword = password;

    updatePassword(user, newPassword)
      .then(() => {
        // Update successful.
      })
      .catch((error) => {
        // An error ocurred
        // ...
      });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmailAdress,
    updatePasswordTxt,
    updateDisplayName,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
