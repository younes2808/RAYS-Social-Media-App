// Fetch conversations for the current user by their user ID
export const fetchConversations = async (userId) => {
    try {
      const response = await fetch(`https://rays-social-media-app.onrender.com/api/Message/conversations/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Sort conversations by timestamp (newest on top)
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      return data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  };

// Fetch messages between two users by their IDs
export const fetchMessagesBetweenUsers = async (senderId, receiverId) => {
  try {
    const response = await fetch(
      `http://localhost:5249/api/message/${senderId}/${receiverId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data; // Return the fetched messages
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error; // Rethrow the error to handle it in the component
  }
};


// Send a message
export const sendMessage = async (senderId, receiverId, content) => {
  if (!content.trim()) {
    throw new Error("Message content cannot be empty");
  }

  const messageToSend = {
    senderId: parseInt(senderId, 10),
    receiverId: parseInt(receiverId, 10),
    content,
  };

  try {
    const response = await fetch("https://rays-social-media-app.onrender.com/api/Message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageToSend),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error; // Rethrow error for handling in the component
  }
};

