import firebase from 'firebase/compat/app';
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyA3i5Y5_mXJEqDovxZCduQJzDdgNUvvKYY",
    authDomain: "ibs-test-6373b.firebaseapp.com",
    projectId: "ibs-test-6373b",
    storageBucket: "ibs-test-6373b.appspot.com",
    messagingSenderId: "827289484144",
    appId: "1:827289484144:web:844dd4d8db5975f2262db5"
  };


  let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.app();
};

const fb = firebase
const fs = firebase.firestore();
const auth = firebase.auth();

export { auth, fs, fb };