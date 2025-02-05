
const BASE_URL = 'https://rays-social-media-app.onrender.com/api';

// Fetch friendship status for a given user
export const fetchFriendshipStatus = async (currentUserId, targetUserId) => {
  const requestsResponse = await fetch(`${BASE_URL}/FriendRequest/requests/${currentUserId}`);
  if (!requestsResponse.ok) throw new Error('Failed to fetch friend requests');

  const requests = await requestsResponse.json();
  const receivedRequest = requests.find(request => request.senderId === parseInt(targetUserId) && !request.isSender);
  const sentRequest = requests.find(request => request.receiverId === parseInt(targetUserId) && request.isSender);

  const friendsResponse = await fetch(`${BASE_URL}/FriendRequest/${currentUserId}`);
  if (!friendsResponse.ok) throw new Error('Failed to fetch friends');

  const friends = await friendsResponse.json();
  const friendExists = friends.some(friend => friend.friendId === parseInt(targetUserId));

  return {
    friendExists,
    sentRequest,
    receivedRequest,
  };
};

// Send a friend request
export const sendFriendRequest = async (currentUserId, targetUserId) => {
  const response = await fetch(`${BASE_URL}/FriendRequest/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ senderId: currentUserId, receiverId: targetUserId }),
  });
  if (!response.ok) throw new Error('Failed to send friend request');
};

// Delete a friend
export const deleteFriend = async (currentUserId, targetUserId) => {
  const response = await fetch(`${BASE_URL}/FriendRequest/${currentUserId}/${targetUserId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete friend');
};

// Accept a friend request
export const acceptFriendRequest = async (currentUserId, userId) => {
  const requestsResponse = await fetch(`${BASE_URL}/FriendRequest/requests/${currentUserId}`);
  if (!requestsResponse.ok) throw new Error('Failed to fetch friend requests');

  const requests = await requestsResponse.json();
  const receivedRequest = requests.find(request => request.senderId === parseInt(userId) && !request.isSender);

  if (receivedRequest) {
    const requestId = receivedRequest.id;
    const response = await fetch(`${BASE_URL}/FriendRequest/accept/${requestId}`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to accept friend request');
  } else {
    throw new Error('No pending friend request found to accept.');
  }
};
