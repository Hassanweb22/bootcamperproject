import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

let firebaseConfig = {
    apiKey: "AIzaSyCfB8GzGzKO7HY4BnGSAuiiP8AQRPhWnhQ",
    authDomain: "parkingapp-a3b26.firebaseapp.com",
    projectId: "parkingapp-a3b26",
    storageBucket: "parkingapp-a3b26.appspot.com",
    messagingSenderId: "335333417711",
    appId: "1:335333417711:web:82bb139bc981c94928311a"
};
// Initialize Firebase

export const googleProvider = new firebase.auth.GoogleAuthProvider();

export default firebase.initializeApp(firebaseConfig);
