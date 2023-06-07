// Function to fetch blog post data from the API
async function fetchBlogPosts() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching blog posts:', error);
        throw error;
    }
}

// Function to display blog posts in the UI
function displayBlogPosts(posts) {
    const blogPostsContainer = document.getElementById('blogPosts');
    blogPostsContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = createPostElement(post);
        blogPostsContainer.appendChild(postElement);
    });
}

// Function to create an individual blog post element
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.body}</p>
      <button class="deleteBtn" data-id="${post.id}">Delete</button>
    `;
    return postElement;
}

// Function to add a new blog post
async function addBlogPost(event) {
    event.preventDefault();

    const titleInput = document.getElementById('titleInput');
    const bodyInput = document.getElementById('bodyInput');

    const newPost = {
        title: titleInput.value,
        body: bodyInput.value
    };

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        });

        if (!response.ok) {
            throw new Error('Failed to add new blog post');
        }

        const data = await response.json();
        const postElement = createPostElement(data);

        const blogPostsContainer = document.getElementById('blogPosts');
        blogPostsContainer.prepend(postElement);

        titleInput.value = '';
        bodyInput.value = '';
    } catch (error) {
        console.log('Error adding new blog post:', error);
    }
}

// Function to delete a blog post
async function deleteBlogPost(event) {
    const postId = event.target.dataset.id;

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete blog post');
        }

        const postElement = event.target.parentElement;
        postElement.remove();
    } catch (error) {
        console.log('Error deleting blog post:', error);
    }
}

// Event listener for adding a new blog post
const addBlogForm = document.getElementById('addBlogForm');
addBlogForm.addEventListener('submit', addBlogPost);

// Event delegation for deleting a blog post
const blogPostsContainer = document.getElementById('blogPosts');
blogPostsContainer.addEventListener('click', event => {
    if (event.target.classList.contains('deleteBtn')) {
        deleteBlogPost(event);
    }
});

// Fetch and display initial blog posts
fetchBlogPosts()
    .then(posts => {
        displayBlogPosts(posts);
    })
    .catch(error => {
        console.log('Error initializing blog posts:', error);
    });
