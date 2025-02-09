const API_URL = 'https://rays-social-media-app.onrender.com/api';

//Creating post
export const createPost = async (postData) => {
  const formData = new FormData();
  formData.append('Content', postData.postText);
  formData.append('Location', postData.location);
  formData.append('UserId', postData.userId);
  formData.append('VideoUrl', postData.link);

  if (postData.selectedFile) {
    formData.append('Image', postData.selectedFile);
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to post');
    }

    return response; // Return response for further processing if needed
  } catch (error) {
    console.error('Error creating post:', error);
    throw error; // Re-throw the error for handling in the component
  }
};
