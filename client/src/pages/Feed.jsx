import React, { useState, useEffect } from "react";
import API from "../utils/api";  // Import your API utility
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import ImageModal from '../components/ImageModal';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    const fetchAllPosts = async () => {
        try {
            const response = await API.get('/feed');  // Use API.get instead of axios.get
            setPosts(response.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    useEffect(() => {
        fetchAllPosts();
    }, []);

    // Handle image click to open modal
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalIsOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={() => navigate('/profile')}
                className="text-blue-500 flex items-center mb-6"
            >
                <FaArrowLeft className="mr-2" /> Go to Profile
            </button>
            <h1 className="text-4xl font-bold mb-6 text-center">All Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <div key={post._id} className="border rounded-lg shadow-md p-4 bg-white">
                        <img
                            src={post.imageUrl}
                            alt={post.caption}
                            className="w-full h-64 object-cover rounded-md cursor-pointer"
                            onClick={() => handleImageClick(post.imageUrl)} // Open modal on image click
                        />
                        <h2 className="text-lg font-bold mt-2">{post.caption}</h2>
                        <p className="text-sm text-gray-600">Posted by {post.postedBy}</p>
                    </div>
                ))}
            </div>
            <ImageModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                imageUrl={selectedImage}
            />
        </div>
    );
};

export default Feed;
