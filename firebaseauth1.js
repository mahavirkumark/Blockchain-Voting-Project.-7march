import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB78RTVCg0cmSPp7A1RJyyAgBuCeolO0cc",
    authDomain: "sk12-58e9e.firebaseapp.com",
    databaseURL: "https://sk12-58e9e-default-rtdb.firebaseio.com",
    projectId: "sk12-58e9e",
    storageBucket: "sk12-58e9e.firebasestorage.app",
    messagingSenderId: "470207874652",
    appId: "1:470207874652:web:67ba1cf3629b7e5b144899"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Function to show messages to the user
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

    // Show message for 3 seconds
    setTimeout(function () {
        messageDiv.style.opacity = 0;

        // After opacity is reduced, hide the message completely
        setTimeout(function () {
            messageDiv.style.display = "none";
        }, 3000); // Delay for the fade-out effect
    }, 6000); // Wait for 3 seconds before fading out
}


// SignUp functionality (without creating a user in Firebase Auth)
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;
    const password = document.getElementById('rPassword').value;
    
    // Get the Firestore instance
    const db = getFirestore();

    // Storing user information in Firestore
    const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password
    };

  // Create a Firestore document with the user's information
 // Create a Firestore document with the user's information
const docRef = doc(db, "users", email); // Using email as document ID (unique identifier)
setDoc(docRef, userData)
    .then(() => {
        // Show the success message
        showMessage('Account Created successfully', 'signUpMessage');

        // Add a 3-second delay before redirecting
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect after 3 seconds
        }, 3000); // 3-second delay
    })
    .catch((error) => {
        console.error("Error storing user data", error);
        showMessage('Error storing user data', 'signUpMessage');
    });

                           
        
});

// SignIn functionality
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'homepage.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not Exist', 'signInMessage');
            }
        });
});