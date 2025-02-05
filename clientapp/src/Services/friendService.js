const BASE_URL = 'https://rays-social-media-app.onrender.com/api'; // Base URL for the API

// Function to get friend requests based on userID
export const getFriendRequests = async (userId) => {
  try {
    // Fetch friend requests for the given userId
    const response = await fetch(`${BASE_URL}/FriendRequest/requests/${userId}`);
    if (!response.ok) throw new Error(`Failed to fetch friend requests`); // Check if the response is okay
    const data = await response.json(); // Parse the JSON data
    return data.filter(request => !request.isSender); // Return only requests that are not sent by the user
  } catch (error) {
    console.error("Error fetching friend requests:", error); // Log the error
    throw error; // Rethrow the error for handling in the calling code
  }
};

// Function to accept a friend request
export const acceptFriendRequest = async (requestId) => {
  try {
    // Send a PUT request to accept the friend request
    const response = await fetch(`${BASE_URL}/FriendRequest/accept/${requestId}`, {
      method: 'PUT', // Specify the method as PUT
    });
    if (!response.ok) throw new Error("Failed to accept request"); // Check for errors in the response
  } catch (error) {
    console.error("Error accepting friend request:", error); // Log the error
    throw error; // Rethrow the error for handling
  }
};

// Function to reject a friend request
export const rejectFriendRequest = async (requestId) => {
  try {
    // Send a PUT request to reject the friend request
    const response = await fetch(`${BASE_URL}/FriendRequest/reject/${requestId}`, {
      method: 'PUT', // Specify the method as PUT
    });
    if (!response.ok) throw new Error("Failed to reject request"); // Check for errors in the response
  } catch (error) {
    console.error("Error rejecting friend request:", error); // Log the error
    throw error; // Rethrow the error for handling
  }
};

// Function to retrieve friends based on userID
export const fetchFriendsByUserId = async (userId) => {
  try {
    // Fetch friends for the given userId
    const response = await fetch(`${BASE_URL}/FriendRequest/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Check for errors in the response
    }
    return response.json(); // Return the array of friend data
  } catch (error) {
    console.error("Error fetching friends:", error); // Log the error
    throw error; // Rethrow the error for handling
  }
};

// Function to get details for each friend using their ID
export const fetchFriendDetails = async (friendId) => {
  try {
    // Fetch user details for the given friendId
    const response = await fetch(`${BASE_URL}/User/${friendId}`); // Assume this is the endpoint to fetch user data
    if (!response.ok) throw new Error(`Failed to fetch user with ID: ${friendId}`); // Check for errors
    return response.json(); // Return the friend's details
  } catch (error) {
    console.error("Error fetching friend details:", error); // Log the error
    throw error; // Rethrow the error for handling
  }
};
