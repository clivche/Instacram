import {see_likes, see_comments, like_post} from './home.js'

/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

export function loadFeed(start) {
    var url = new URL("http://localhost:5000/user/feed");
    var query = {p: start, n: 5};
    url.search = new URLSearchParams(query);
    fetch(url, {
        method: "GET", 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': document.cookie,
        },
    })
    .then(posts => {
        if (posts.status == 200) {
            posts.json().then(data => {
                if (data.posts.length != 0) {
                    var large_feed = document.getElementById('large-feed');
                    for (var i = 0; i < data.posts.length; i++) {
                        large_feed.appendChild(createPostTile(data.posts[i]));
                    }
                }
                else {
                    if (document.getElementById('large-feed').childNodes.length == 0){
                        document.getElementById('noposts').innerHTML = "No posts to display."
                    }
                }
            })
        }
        else if (posts.status == 403) {
            alert("Session Lost: Please Login Again");
        }
    })
    .catch(error => {
        console.log(error);
    });
}

export function createElement(tag, data, options = {}) {
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

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createPostTile(post) {
    const section = createElement('section', null, { class: 'post' });

    section.appendChild(createElement('h2', post.meta.author, { class: 'post-title' }));

    section.appendChild(createElement('img', null, 
        { src: "data:image/png;base64," + post.src, alt: post.meta.description_text, class: 'post-image' }));

    section.appendChild(createElement('h2', "published: " + post.meta.published, { class: 'post-time' }));

    if (post.meta.description_text != "") { 
        section.appendChild(createElement('h2', '"' + post.meta.description_text + '"', { class: 'post-desc' }));
    }
    var buttons = document.createElement('div');
    section.appendChild(createElement('button', 'LIKE', {class: 'like', id: post.id}))
    buttons.appendChild(createElement('button', 'see likes (' + post.meta.likes.length + ')', { class: 'like_button', likelist: post.meta.likes}));
    buttons.appendChild(createElement('button', 'see comments (' + post.comments.length + ')', { class: 'comment_button', commentlist: post.comments }));
    section.appendChild(buttons);

    return section;
}


// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();

    reader.onload = (e) => {
        // do something with the data result
        var source = e.target.result;
        source = source.replace("data:image/jpeg;base64,", "");
        source = source.replace("data:image/png;base64,", "");
        source = source.replace("data:image/jpg;base64,", "");
        var jsonObject = { 
            description_text: document.getElementById('descText').value,
            src: source
        };
        fetch("http://localhost:5000/post", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": document.cookie
            },
            body: JSON.stringify(jsonObject),
        })
        .then(res => {
            if (res.status == 200) {
                alert("Post Successful")
                location.reload();
            }
            else if (res.status == 400) {
                alert("Please Complete All Fields");
            }
        })
        .catch(error => {
            console.log(error);
        });
    };
    reader.readAsDataURL(file);

}

/* 
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/
export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null
}