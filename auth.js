// SIGN IN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCJqOyfm6AAPaNQrdaslRQv-hlA4nylaz8",
    authDomain: "foodie-app-4ade7.firebaseapp.com",
    projectId: "foodie-app-4ade7",
    storageBucket: "foodie-app-4ade7.firebasestorage.app",
    messagingSenderId: "708426307125",
    appId: "1:708426307125:web:f8ecef9ee597a8c020c37c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signBtns = document.querySelectorAll(".desktop-action .btn, .mobile-menu .btn");

function getSignButtons() {
    return [...signBtns];
}

function updateButtons(user) {
    signBtns.forEach(btn => {
        if (user) {
            btn.innerHTML = `
                Sign Out &nbsp;
                <i class="fa-solid fa-right-from-bracket"></i>
            `;
        } else {
            btn.innerHTML = `
                Sign In &nbsp;
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
            `;
        }
    });
}


onAuthStateChanged(auth, (user) => {

    updateButtons(user);

    if (user) {

        const userData = {
            name: user.displayName,
            photo: user.photoURL,
            email: user.email
        };


        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

    }
    else {

        localStorage.removeItem("user");

    }

});
