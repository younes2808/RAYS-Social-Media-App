const BASE_URL = 'https://rays-social-media-app.onrender.com/api';
//fetching liked posts by userID
export const fetchLikedPostsByUserId = async (userId) => {
  const response = await fetch(`${BASE_URL}/Post/likedby/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch liked posts');
  }
  return response.json();
};

