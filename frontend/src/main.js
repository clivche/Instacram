// LOGIN MODAL FUNCTIONS
const login = document.getElementById("login");
login.addEventListener('click', openLoginModal);
var loginModal = document.getElementById('loginModal');
function openLoginModal() {
    loginModal.style.display = "block";
}
var loginSpan = document.getElementById("loginCloseButton");
loginSpan.onclick = function() {
    loginModal.style.display = "none";
}
const loginSubmit = document.getElementById('loginSubmit');
loginSubmit.addEventListener('click', submitLogin);
function submitLogin() {
    const loginUsernameInput = document.getElementById('loginUsernameInput').value;
    const loginPasswordInput = document.getElementById('loginPasswordInput').value;
    var loginJson = {
        "username": loginUsernameInput,
        "password": loginPasswordInput
    };

    useAuthFetch(loginJson, "login")
}

// SIGNUP MODAL FUNCTIONS
const signUp = document.getElementById("signUp");
signUp.addEventListener('click', openSignUpModal);
var signUpModal = document.getElementById('signUpModal');
function openSignUpModal() {
    signUpModal.style.display = "block";
}
var signUpSpan = document.getElementById("signUpCloseButton");
signUpSpan.onclick = function() {
    signUpModal.style.display = "none";
}
const signUpSubmit = document.getElementById('signUpSubmit');
signUpSubmit.addEventListener('click', submitSignUp);
function submitSignUp() {
    const signUpUsernameInput = document.getElementById('signUpUsernameInput').value;
    const signUpPasswordInput = document.getElementById('signUpPasswordInput').value;
    const signUpEmailInput = document.getElementById('signUpEmailInput').value;
    const signUpNameInput = document.getElementById('signUpNameInput').value;

    var signUpJson = {
        "username": signUpUsernameInput,
        "password": signUpPasswordInput,
        "email": signUpEmailInput,
        "name": signUpNameInput
    };

    useAuthFetch(signUpJson, "signup");
}

// SHARED FUNCTIONS
function useAuthFetch(jsonObject, path){
    fetch("http://localhost:5000/auth/" + path, {
        method: "POST",
        headers: {
             "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(jsonObject),
    })
    .then(res => {
        if (res.status == 200) {
            res.json().then(data => {
                document.cookie = "Token " + data.token;
                alert("Successfully Logged In")
                window.location.replace("http://localhost:8080/home.html");
            })
        }
        else if (res.status == 400) {
            alert("Please Complete All Fields");
        }
        else if (res.status == 403) {
            alert("Invalid Username/Password");
        }
        else if (res.status == 409) {
            alert("Username Taken");
        }
    })
    .catch(error => {
        console.log(error);
    });

}
window.onclick = function(event) {
    if (event.target == loginModal || event.target == signUpModal) {
        loginModal.style.display = "none";
        signUpModal.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    var element = document.getElementById('body');
    var height = element.offsetHeight;
    if (height < screen.height) {
        document.getElementById("footer").classList.add('stikybottom');
    }
}, false);
