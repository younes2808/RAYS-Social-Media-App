import React, { useState, useEffect, useCallback } from 'react';
import '../Styles/Rays.css'; // Adjust the path if necessary
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';
import { createPost } from './../Services/createPostService'; // Import the service function

// Initialize the default icon for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl; 
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Main map component for PostFunction
const PostFunction = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isVideo, setIsVideo] = useState(false);
    const [link, setLink] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [postText, setPostText] = useState('');
    const [location, setLocation] = useState(''); // Holds the location string
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [username, setUsername] = useState(''); // State to store username
    const [error, setError] = useState(''); // State for error messages
    const [showErrorPopup, setShowErrorPopup] = useState(false); // State to control error popup
  
    // Fetch user from sessionStorage
    useEffect(() => {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.id);
        setUsername(parsedUser.username); // Set username
      } else {
        console.error("No user found in sessionStorage.");
      }
    }, []);

    // Handle file selection
    const fileSelectedHandler = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setIsVideo(file.type.includes('video'));
        }
    };

    // Remove selected file
    const removeSelectedFile = () => {
        setSelectedFile(null); // Clear selected file
        setIsVideo(false); // Reset video flag
    };

    // Toggle visibility of link input
    const toggleLinkInput = () => {
        setShowLinkInput(!showLinkInput);
    };

    // Handle link input change
    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    // Handle post text change
    const handleTextChange = (event) => {
        setPostText(event.target.value);
        setError(''); // Clear error when text changes
    };

    // Handle post submission
    const postHandler = async () => {
        if (!userId) {
            console.log("user not found");
            return;
        }

        // Validation: Check if postText is empty
        if (postText.trim() === '') {
            setError('Please write something before posting.'); // Set error message
            setShowErrorPopup(true); // Show the error popup
            return;
        }

        setLoading(true);

        // Prepare post data
        const postData = {
            postText,
            location: typeof location === 'string' ? location : String(location),
            userId,
            link,
            selectedFile,
        };

        try {
            await createPost(postData); // Call the service function
            // Reset form after successful submission
            setPostText('');
            setLink('');
            setLocation(''); // Reset location
            removeSelectedFile(); // Clear the selected file
            window.location.reload();
        } catch (err) {
            console.error('Failed to create post:', err);
        } finally {
            setLoading(false);
        }
    };

    // Close error popup
    const closeErrorPopup = () => {
        setShowErrorPopup(false);
        setError(''); // Clear the error message
    };

    return (
        <div className="flex justify-center p-0">
            <div className="bg-emerald-200 rounded-lg min-w-full p-5 mt-16 510px:mt-3 shadow-md">
                {/* Profile image and post textarea */}
                <div className="flex items-center mb-4">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full mr-4 bg-white text-lg font-medium text-black">{username.charAt(0).toUpperCase()}</span> {/* Display the first letter of the username */}
                    <textarea
                        maxLength={1000}
                        value={postText}
                        onChange={handleTextChange}
                        placeholder="What's happening?"
                        className="post-textarea w-full p-4 bg-white focus:ring-emerald-500 focus:ring-2 text-black rounded-lg resize-none h-28"
                    />
                </div>

                {/* Input for link */}
                {showLinkInput && (
                    <div className="my-4">
                        <input
                            type="url"
                            value={link}
                            onChange={handleLinkChange}
                            placeholder="Enter link..."
                            className="w-full p-3 bg-white focus:ring-emerald-500 focus:ring-2 text-black rounded-lg focus:outline-none"
                        />
                    </div>
                )}

                {/* Media preview */}
                {selectedFile && (
                    <div className="relative mb-4">
                        {isVideo ? (
                            <video src={URL.createObjectURL(selectedFile)} controls className="w-full max-h-60 rounded-lg" />
                        ) : (
                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full max-h-60 object-cover rounded-lg" />
                        )}
                        <button
                            onClick={removeSelectedFile}
                            className="absolute top-0 right-0 bg-white text-black rounded-full w-6 h-6 flex justify-center items-center hover:bg-red-500"
                        >
                            X
                        </button>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center justify-start 400px:space-x-2 580px:space-x-0">
                    <div className="flex 300px:ml-[-0.9rem] space-x-1 580px:ml-0 580px:space-x-2 flex-grow">
                        <input
                            style={{ display: 'none' }}
                            type="file"
                            onChange={fileSelectedHandler}
                            id="file-upload-button"
                            accept="image/*,video/*"
                        />
                        <label
                            htmlFor="file-upload-button"
                            className="hidden 510px:block items-center justify-center px-2 py-1 bg-white text-black rounded-lg cursor-pointer hover:bg-emerald-500 hover:text-white transition-colors duration-300 text-sm font-general"
                        >
                            <span className="material-icons mr-1">photo</span>
                            Media
                        </label>
                        <button
                            className="flex items-center justify-center px-1 580px:px-2 py-1 bg-white text-black rounded-lg cursor-pointer hover:bg-emerald-500 hover:text-white transition-colors duration-300 text-sm font-general"
                            onClick={toggleLinkInput}
                        >
                            <span className="material-icons mr-1">link</span>
                            Hyperlink
                        </button>

                        {/* Show Map button */}
                        <button
                            className="flex items-center justify-center px-1 580px:px-2 py-1 bg-white text-black rounded-lg cursor-pointer hover:bg-emerald-500 hover:text-white transition-colors duration-300 text-sm font-general"
                            onClick={() => {
                                setShowMap(prevState => {
                                    if (prevState) {
                                        // If the map is currently shown, clear the location when hiding
                                        setLocation(''); // Reset location when hiding the map
                                    }
                                    return !prevState; // Toggle visibility
                                });
                            }}
                        >
                            <span className="material-icons mr-1">location_on</span>
                            {showMap ? 'Hide Map' : 'Show Map'}
                        </button>
                    </div>

                    {/* Post button */}
                    <button
                        onClick={postHandler}
                        className={`flex items-center justify-center px-2 355px:px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors duration-300 text-sm font-general ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Posting...' : 'Post'}
                        <span className="material-icons ml-1">send</span>
                    </button>
                </div>

                {/* Error Popup */}
                {showErrorPopup && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"> {/* Add z-50 */}
                      <div className="bg-white rounded-lg p-5 text-center">
                          <h2 className="text-lg font-bold text-red-600">Error</h2>
                          <p className="mt-2">{error}</p>
                          <button
                              className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg"
                              onClick={closeErrorPopup}
                          >
                              Close
                          </button>
                      </div>
                  </div>
                )}

                {/* Show Map only if the error popup is not shown */}
                {!showErrorPopup && showMap && (
                    <div className="my-4 bg-emerald-200 rounded-lg p-4">
                        <MapContainer
                            center={[20, 0]} // Center the map on load
                            zoom={2} // Initial zoom level
                            style={{ height: '400px', width: '100%' }} // Ensure the map takes full space
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <MapContent setLocation={setLocation} /> {/* Pass setLocation to MapContent */}
                        </MapContainer>
                        <p className="text-black mt-2">Location: {location}</p> {/* Display selected location */}
                    </div>
                )}
            </div>
        </div>
    );
};

// Separate component for map interactions
const MapContent = ({ setLocation }) => {
    const [position, setPosition] = useState(null); // Position state for marker
    const map = useMap(); // Access the map instance

    // Handle map click to set position
    const handleMapClick = useCallback((event) => {
        const { lat, lng } = event.latlng; // Get the lat and lng from the click event
        console.log('Map clicked at:', { lat, lng }); // Debug log
        setPosition([lat, lng]); // Update position state with lat and lng
        setLocation(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`); // Update location state with formatted string
    }, [setLocation]); // Dependencies are now stable

    // Attach the click event handler to the map when the component mounts
    useEffect(() => {
        map.on('click', handleMapClick); // Attach the click event to the map

        return () => {
            map.off('click', handleMapClick); // Clean up the event listener on component unmount
        };
    }, [map, handleMapClick]); // Now all dependencies are included and stable

    return (
        <>
            {position && ( // Render marker only if position is set
                <Marker position={position}>
                    <Popup>{`Marker at: ${position[0].toFixed(5)}, ${position[1].toFixed(5)}`}</Popup> {/* Optional: Show coordinates in popup */}
                </Marker>
            )}
        </>
    );
};

export default PostFunction;