import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB78RTVCg0cmSPp7A1RJyyAgBuCeolO0cc",
    authDomain: "sk12-58e9e.firebaseapp.com",
    databaseURL: "https://sk12-58e9e-default-rtdb.firebaseio.com",
    projectId: "sk12-58e9e",
    storageBucket: "sk12-58e9e.firebasestorage.app",
    messagingSenderId: "470207874652",
    appId: "1:470207874652:web:67ba1cf3629b7e5b144899"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


function loadUnverifiedUsers() {
    const userListDiv = document.getElementById('userList');
    userListDiv.innerHTML = ''; 
    const usersCollection = collection(db, 'users');

    getDocs(usersCollection).then((querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
            const userData = docSnapshot.data();
            const userItem = document.createElement('div');
            userItem.classList.add('user-item');
            userItem.innerHTML = `
                <p>${userData.firstName} ${userData.lastName} - ${userData.email}</p>
                <button class="done-btn" onclick="verifyUser('${docSnapshot.id}', '${userData.email}', '${userData.firstName}', '${userData.lastName}','${userData.password}')">Done</button>
            `;
            userListDiv.appendChild(userItem);
        });
    }).catch((error) => {
        console.error('Error fetching users: ', error);
    });
}

function verifyUser(userId, email, firstName, lastName,password) {
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            const verifiedUserData = {
                email: email,
                firstName: firstName,
                lastName: lastName
            };

            const verifiedUserDoc = doc(db, 'verifiedUser', user.uid);
            setDoc(verifiedUserDoc, verifiedUserData)
                .then(() => {
                    // Delete from the 'users' collection after verifying
                    const userDoc = doc(db, 'users', userId);
                    deleteDoc(userDoc)
                        .then(() => {
            // Prepare the verified user data
                            alert('User verified and moved to verifiedUser.');
                            loadUnverifiedUsers(); // Reload the user list
                        })
                        .catch((error) => {
                            console.error('Error deleting user: ', error);
                        });
            // Set the verified user data in 'verifiedUser' collection
                })
                .catch((error) => {
                    console.error('Error moving user to verifiedUser: ', error);
                    // Delete the user from the 'users' collection after verification
                });
        })
        .catch((error) => {
            console.error('Error creating user in Firebase Auth: ', error);
        });
}

// Attach functions to the global window object
window.verifyUser = verifyUser;

// Load unverified users on page load
window.onload = function () {
    loadUnverifiedUsers();
};