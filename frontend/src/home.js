// Imports
import { loadFeed, uploadImage } from './helpers.js';

// Feed
loadFeed(0);


// Profile
var currUser = document.getElementById('currUser');
fetch("http://localhost:5000/user", {
    method: "GET",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': document.cookie,
    }
})
.then(res => {
    res.json().then(data => {
        currUser.innerHTML = "User: " + data.username;
    })
})
.catch(error => {
    console.log(error);
});

currUser.onclick = function() { window.location.replace('http://localhost:8080/profile.html') }; 


// Make A Post
var makePost = document.getElementById('makePost');
makePost.addEventListener('click', () => {
    var makePostModal = document.getElementById('makePostModal');
    makePostModal.style.display = "block";
})
var uploadButton = document.querySelector('input[type="file"]');
uploadButton.addEventListener('change', uploadImage);

// Open Like List
export function see_likes(list) {
    openListModal();
    var listModalContent = document.getElementsByClassName('list-modal-content')[0];
    var header = document.getElementById('listHeader');
    var ul = document.getElementById('ulist');

    listModalContent.style.background = "linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%)";
    listModalContent.style.color = "white";

    header.innerHTML = "Liked By:"
    ul.innerHTML = "";

    if (list.length == 0) {
        var h2 = document.createElement('h2');
        h2.innerHTML = "No Likes Yet";
        ul.appendChild(h2);
    }
    else {
        for (var like in list) {
            var url = new URL("http://localhost:5000/user");
            var query = {id: list[like]};
            url.search = new URLSearchParams(query);
            fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': document.cookie,
                }
            })
            .then(res => {
                res.json().then(data => {
                    var li = document.createElement('li');
                    li.innerHTML = data.username;
                    ul.appendChild(li);
                })
            })
            .catch(error => {
                console.log(error);
            }); 
        }
    }
}

// Open Comment List
export function see_comments(list) {
    openListModal();
    var listModalContent = document.getElementsByClassName('list-modal-content')[0];
    listModalContent.style.background = "linear-gradient(321deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%)";
    listModalContent.style.color = "white";
    var header = document.getElementById('listHeader');
    header.innerHTML = "Comments:"
    var ul = document.getElementById('ulist');
    ul.innerHTML = "";
    if (list.length == 0) {
        var h2 = document.createElement('h2');
        h2.innerHTML = "No Comments Yet";
        ul.appendChild(h2);
    }
    else {
        for (var i in list) {
            var commObj = 'User: ' + list[i].author + ' | Published: ' + list[i].published + " | Comment: " + list[i].comment;
            var li = document.createElement('li');
            li.innerHTML = commObj;
            ul.appendChild(li);
        }
    }
}

// Shared Modal Functions
var listModal = document.getElementById('listModal');
function openListModal() {
    listModal.style.display = "block";
}
var listSpan = document.getElementById('listCloseButton');
listSpan.onclick = function() {
    listModal.style.display = "none";
}
var postSpan = document.getElementById('makePostCloseButton');
postSpan.onclick = function() {
    makePostModal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == listModal || event.target == makePostModal) {
        listModal.style.display = "none";
        makePostModal.style.display = "none";
    }
}

// Like A Post
export function like_post(post_id) {
    var url = new URL("http://localhost:5000/post/like");
    var query = {id: post_id};
    url.search = new URLSearchParams(query);
    fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': document.cookie,
        }
    })
    .then(res => {
        if (res.status == 200) {
            alert("Liked!");
        }
        else {
            alert("Error:" + res.status)
        }
    })
}

// Infinite Scroll
var el = document.getElementById('large-feed');
var offset = 0;
window.addEventListener('scroll', checkBottom);
function checkBottom() {
    if ((window.innerHeight + window.pageYOffset) + window.innerHeight >= document.documentElement.scrollHeight) {
        if (offset != document.getElementById('large-feed').childNodes.length) {
            offset = document.getElementById('large-feed').childNodes.length;
            loadFeed(offset);
        }
    }
}

// THIS CODE IS DIRECTLY FROM https://www.w3schools.com/howto/howto_js_sticky_header.asp
// Sticky the header during scroll
var header = document.getElementById("homeHeader");
window.onscroll = function() {mySticky()};
var sticky = header.offsetTop;
function mySticky() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}
// THIS CODE IS DIRECTLY FROM https://www.w3schools.com/howto/howto_js_sticky_header.asp