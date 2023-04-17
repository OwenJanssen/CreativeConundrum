// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, update} from 'firebase/database';
import { useCallback, useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPiQPAFm622xxRQ9YpvEWbYMGQ8n4OzcY",
  authDomain: "creativeconundrum-359b0.firebaseapp.com",
  databaseURL: "https://creativeconundrum-359b0-default-rtdb.firebaseio.com",
  projectId: "creativeconundrum-359b0",
  storageBucket: "creativeconundrum-359b0.appspot.com",
  messagingSenderId: "242644104618",
  appId: "1:242644104618:web:6b09edf760b129b78fe7d3",
  measurementId: "G-DEMXGZX925"
};


// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useDbData = (path) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(() => (
    onValue(ref(database, path), (snapshot) => {
     setData( snapshot.val() );
    }, (error) => {
      setError(error);
    })
  ), [ path ]);

  return [ data, error ];
};

const makeResult = (error) => {
  const timestamp = Date.now();
  const message = error?.message || `Updated: ${new Date(timestamp).toLocaleString()}`;
  return { timestamp, error, message };
};

export const useDbUpdate = (path) => {
  const [result, setResult] = useState();
  const updateData = useCallback((value) => {
    update(ref(database, path), value)
    .then(() => setResult(makeResult()))
    .catch((error) => setResult(makeResult(error)))
  }, [database, path]);

  return [updateData, result];
};

export const signInWithGoogle = () => {
  signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export { firebaseSignOut as signOut };

export const useAuthState = () => {
  const [user, setUser] = useState();
  
  useEffect(() => (
    onAuthStateChanged(getAuth(firebase), setUser)
  ));

  return [user];
};