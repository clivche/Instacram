var ul = document.getElementById('ulist');
var large_feed = document.getElementById('large-feed');
var listModal = document.getElementById('listModal');
var editModal = document.getElementById('editModal');
var editHeader = document.getElementById('editHeader');
var editInput = document.getElementById('editInput');
var editSubmit = document.getElementById('editSubmit');
var editSpan = document.getElementById('editCloseButton');
var listHeader = document.getElementById('listHeader');
var listSpan = document.getElementById('listCloseButton');
var usernameEl = document.getElementById('profileUsername');
var nameEl = document.getElementById('profileName');
var emailEl = document.getElementById('profileEmail');
var postsEl = document.getElementById('profilePosts');
var following = document.getElementById('profileFollowing');
var followersEl = document.getElementById('profileFollowers');
var mostLikedEl = document.getElementById('profileMostLiked');
var totalLikesEl = document.getElementById('profileTotalLikes');
var changePwdEl = document.getElementById('profileChangePwd');
var jsonObject;
fetch("http://localhost:5000/user", {
    method: "GET",
    headers: {
        'Authorization': document.cookie,
    }
})
.then(res => {
    res.json().then(data => {

        usernameEl.innerHTML = "Username: " + data.username;
        followersEl.innerHTML = "Followers: " + data.followed_num;

        nameEl.innerHTML = "Name: " + data.name;
        nameEl.onclick = function() {
            editModal.style.display = 'block';
            editHeader.innerHTML = "Edit Name";
            editSubmit.onclick = function(){
                var val = editInput.value;
                jsonObject = { "name" : val }
                fetch("http://localhost:5000/user", {
                    method: "PUT",
                    headers: 
                    {
                        "Content-Type": "application/json; charset=utf-8",
                        'Authorization': document.cookie,
                    },
                    body:JSON.stringify(jsonObject)
                })
                .then(res => {
                    if (res.status == 200) {
                        alert("Name Changed")
                        editModal.style.display = 'none';
                        location.reload();
                    }
                })
            }
        }
        emailEl.innerHTML = "Email: " + data.email;
        emailEl.onclick = function() {
            editModal.style.display = 'block';
            editHeader.innerHTML = "Edit Email"
            editSubmit.onclick = function(){
                jsonObject = { "email": editInput.value };
                fetch("http://localhost:5000/user", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        'Authorization': document.cookie,
                    },
                    body: JSON.stringify(jsonObject)
                })
                .then(res => {
                    if (res.status == 200) {
                        alert("Email Changed")
                        editModal.style.display = 'none';
                        location.reload();
                    }
                })
            }
        }
        changePwdEl.innerHTML = "Change Password";
        changePwdEl.onclick = function() {
            editModal.style.display = 'block';
            editHeader.innerHTML = "Edit Password";
            editInput.type='password';
            editSubmit.onclick = function(){
                jsonObject = { "password": editInput.value };
                fetch("http://localhost:5000/user", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        'Authorization': document.cookie,
                    },
                    body: JSON.stringify(jsonObject)
                })
                .then(res => {
                    if (res.status == 200) {
                        alert("Password Changed")
                        editModal.style.display = 'none';
                        location.reload();
                    }
                })
            }
        }
        postsEl.innerHTML = "Posts (" + data.posts.length + ")"; 
        postsEl.onclick = function() {
            listHeader.innerHTML = "Posts:";
            listModal.style.display = 'block';
            large_feed.innerHTML = "";
            ul.innerHTML = "";            
            for (var i = 0; i < data.posts.length; i++) {
                url = "http://localhost:5000/post?id=" + data.posts[i];
                fetch (url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        'Authorization': document.cookie,
                    }
                })
                .then(res => {
                    res.json().then(post => {
                        large_feed.appendChild(createPostTile(post));
                    })
                })
            }
        }
        following.innerHTML = "Following (" + data.following.length + ")";        
        following.onclick = function() {
            listHeader.innerHTML = "Following:";
            listModal.style.display = 'block';
            large_feed.innerHTML = "";
            ul.innerHTML = "";

            for (var i = 0; i < data.following.length; i++) {
                var url = "http://localhost:5000/user?id=" + data.following[i];
                fetch (url, {
                    method: "GET",
                    headers: {
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
            }
        }
        var likes = 0;
        var mostLiked = -1;
        var totalLikes = 0;
        for (var i = 0; i < data.posts.length; i++) {
            var url = "http://localhost:5000/post?id=" + data.posts[i];
            fetch (url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': document.cookie,
                }
            })
            .then(res => {
                res.json().then(data => {
                    totalLikes += data.meta.likes.length;
                    if (data.meta.likes.length >= likes) {
                        mostLiked = data;
                    }
                })
            })
        }
        totalLikesEl.innerHTML = "Total Likes: " + totalLikes;
        if (mostLiked != -1) {
            mostLikedEl.innerHTML = "Most Liked Post";            
            mostLikedEl.onclick = function(){ createPostTile(mostLiked) };
        }

    })
})
.catch(error => {
    console.log(error);
});

document.getElementById('backButton').onclick = function(){ window.location.replace("http://localhost:8080/home.html") };

listSpan.onclick = function() {
    listModal.style.display = "none";
}
editSpan.onclick = function() {
    editModal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == listModal || event.target == editModal) {
        listModal.style.display = "none";
        editModal.style.display = "none";
    }
}


function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
    if (options.hasOwnProperty('likelist')) {
        el.addEventListener('click', function(){see_likes(options.likelist)});
    }
    if (options.hasOwnProperty('commentlist')) {
        el.addEventListener('click', function(){see_comments(options.commentlist)});
    }
    if (options.class == 'like') {
        el.addEventListener('click', function(){like_post(options.id)})
    }
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            if (field != 'likelist' && field != 'commentlist') {
                element.setAttribute(field, value);
            }
            return element;
        }, el);
}

function createPostTile(post) {
    const section = createElement('section', null, { class: 'post' });

    section.appendChild(createElement('h2', post.meta.author, { class: 'post-title' }));

    section.appendChild(createElement('img', null, 
        { src: "data:image/png;base64," + post.src, alt: post.meta.description_text, class: 'post-image' }));

    section.appendChild(createElement('h2', "published:" + post.meta.published, { class: 'post-time' }));

    if (post.meta.description_text != "") { 
        section.appendChild(createElement('h2', '"' + post.meta.description_text + '"', { class: 'post-desc' }));
    }
    var buttons = document.createElement('div');
    section.appendChild(buttons);

    return section;
}

document.addEventListener("DOMContentLoaded", function (event) {
    var element = document.getElementById('body');
    var height = element.offsetHeight;
    if (height < screen.height) {
        document.getElementById("footer").classList.add('stikybottom');
    }
}, false);