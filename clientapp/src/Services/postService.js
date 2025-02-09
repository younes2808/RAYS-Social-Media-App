
const API_URL = 'https://rays-social-media-app.onrender.com/api';
// Fetch posts by user ID
export const fetchPostsByUserId = async (userId) => {
  const response = await fetch(`${API_URL}/Post/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};
//fetch all posts
export const fetchAllPosts = async () => {
  const response = await fetch(`${API_URL}/Post`, {
    method: 'GET', // Explicitly set method to GET
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return response.json();
};
// Fetch likes for a specific postID
export const fetchLikesByPostId = async (postId) => {
  const response = await fetch(`${API_URL}/Like/${postId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch likes');
  }
  return response.json();
};

// Delete a post by post ID
export const deletePostById = async (postId) => {
  const response = await fetch(`${API_URL}/Post/${postId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
};

// Like a post ID
export const likePost = async (userId, postId) => {
  const response = await fetch(`${API_URL}/Like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, postId }),
  });
  if (!response.ok) {
    throw new Error('Failed to like post');
  }
};

// Unlike a post by ID
export const unlikePost = async (userId, postId) => {
  const response = await fetch(`${API_URL}/Like`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, postId }),
  });
  if (!response.ok) {
    throw new Error('Failed to unlike post');
  }
};

// Update a post ID
export const updatePost = async (postId, content, userId) => {
  const formData = new FormData();
  formData.append('Content', content);
  formData.append('UserId', userId);

  const response = await fetch(`${API_URL}/Post/${postId}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to update post');
  }
};
