import firebase from 'firebase';

const firebaseConfig = {
  // Your COnfig Goes Here
};

const telegramApp = firebase.initializeApp(firebaseConfig);

const db = telegramApp.firestore();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export default db;
export { auth, googleProvider };
