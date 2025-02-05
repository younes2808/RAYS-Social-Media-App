//API URL
const API_URL = 'https://rays-social-media-app.onrender.com/api';

//Endpoint for searching after users
export const searchUsers = async (query) => {
  if (!query) {
    throw new Error('Search query is required');
  }

  try {
    const response = await fetch(`${API_URL}/user/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (err) {
    console.error('Error fetching users:', err);
    throw new Error(err.message);
  }
};
