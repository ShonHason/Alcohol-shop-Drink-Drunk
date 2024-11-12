const express = require("express")
const app = express();
const router = express.Router();

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const usernameInput = document.getElementById('Usern');
    const passwordInput = document.getElementById('Pass');

    form.addEventListener("submit", function (event) {
        if (!usernameInput.value || !passwordInput.value) {
            event.preventDefault(); // Prevent form submission
            alert('Please fill in both username and password.');
        }


    });
});


