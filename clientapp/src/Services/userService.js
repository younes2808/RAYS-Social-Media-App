//API URL
const API_URL = 'https://rays-social-media-app.onrender.com/api';

// Fetch username by user ID
export const fetchUsernameById = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/User/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch username');
    }
    
    const userData = await response.json();
    return userData.username;
  } catch (error) {
    console.error('Error fetching username:', error);
    return 'Unknown User';
  }
};

// Fetch user data by user ID
export const getUser = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/User/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();
    return userData; // Return entire user data object
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null; // Return null or handle error appropriately
  }
};

// Fetch friend details
export const fetchFriendDetails = async (friendIds) => {
  const details = await Promise.all(
    friendIds.map(async (friend) => {
      const response = await fetch(`${API_URL}/User/${friend.friendId}`);
      if (!response.ok) {
        console.error(`Failed to fetch details for friendId ${friend.friendId}`);
        return null;
      }
      return response.json(); // Assume it returns user data with username
    })
  );
  return details.filter(detail => detail !== null); // Filter out null responses
};

// Function to handle user login
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/User/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return response; // Return the response object
  } catch (error) {
    console.error('Error during login:', error);
    throw error; // Rethrow the error to be handled in the component
  }
};

// Function to register a new user
export const registerUser = async (email, username, password) => {
  try {
    const response = await fetch(`${API_URL}/User/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json(); // Return the response if needed
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Rethrow error for handling in the component
  }
};

