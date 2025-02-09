const API_URL = 'https://rays-social-media-app.onrender.com/api';
//Fetching comments for posts
export const fetchComments = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/Comment/${postId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    return await response.json();
  } catch (err) {
    console.error('Error fetching comments:', err);
    throw new Error(err.message);
  }
};
//Creating comment
export const createComment = async (commentPayload) => {
  try {
    const response = await fetch(`${API_URL}/Comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to post comment: ' + (errorData.comment || 'Unknown error'));
    }

    return await response.json();
  } catch (err) {
    console.error('Error while posting comment:', err);
    throw new Error(err.message);
  }
};

export const updateComment = async (commentUpdatePayload) => {
  try {
    const response = await fetch(`${API_URL}/Comment/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentUpdatePayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to update comment: ' + (errorData.comment || 'Unknown error'));
    }
  } catch (err) {
    console.error('Error while updating comment:', err);
    throw new Error(err.message);
  }
};

export const deleteComment = async (commentId, userId) => {
  try {
    const response = await fetch(`${API_URL}/Comment/${commentId}?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to delete comment: ' + (errorData.comment || 'Unknown error'));
    }
  } catch (err) {
    console.error('Error while deleting comment:', err);
    throw new Error(err.message);
  }
};
