import React, { useEffect, useState, useContext } from 'react';
import API from '../utils/api'; // Import your API utility
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaPlusCircle, FaArrowLeft, FaTasks, FaSignOutAlt } from 'react-icons/fa';
import ImageModal from '../components/ImageModal';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
    const { logout } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    // Fetch user's posts when the component loads
    useEffect(() => {
        fetchUserPosts();
    }, []);

    const fetchUserPosts = async () => {
        try {
            const response = await API.get('/feed/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (Array.isArray(response.data)) {
                setPosts(response.data);
            } else {
                setPosts([]);
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError('Failed to fetch posts.');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete post
    const handleDeletePost = async (postId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token provided. Please log in again.');
                return;
            }

            const response = await API.delete(`/feed/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log('Post deleted successfully');
                setPosts(posts.filter(post => post._id !== postId)); // Remove deleted post from state
            } else {
                setError('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            setError('Failed to delete post');
        }
    };

    // Handle edit post (redirect to edit page)
    const handleEditPost = (postId) => {
        navigate(`/edit/${postId}`, { state: { postId } });
    };

    // Handle image click to open modal
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalIsOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between mb-6">
                <button
                    onClick={() => navigate('/tasks')}
                    className="text-blue-500 flex items-center mb-6"
                >
                    <FaTasks className="mr-2" /> Go to Tasks
                </button>
                <button
                    onClick={() => navigate('/feed')}
                    className="text-blue-500 flex items-center mb-6"
                >
                    <FaArrowLeft className="mr-2" /> Go to Feed
                </button>
                <button
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                    className="text-blue-500 flex items-center mb-6"
                >
                    <FaSignOutAlt className="mr-2" /> Logout
                </button>
            </div>
            <h1 className="text-4xl font-bold mb-6 text-center">Your Posts</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg font-medium">Loading...</p>
                </div>
            ) : (
                <div>
                    {posts.length === 0 ? (
                        <div className="flex flex-col items-center">
                            <p className="text-lg font-medium mb-4">No posts available. Create your first post!</p>
                            <button
                                onClick={() => navigate('/create-post')}
                                className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md"
                            >
                                <FaPlusCircle className="mr-2" /> Create New Post
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.isArray(posts) && posts.map((post) => (
                                <div key={post._id} className="border p-4 rounded-lg shadow-md bg-white">
                                    <img
                                        src={post.imageUrl}
                                        alt={post.caption}
                                        className="w-full h-48 object-cover rounded-md cursor-pointer"
                                        onClick={() => handleImageClick(post.imageUrl)}
                                    />
                                    <h3 className="mt-2 font-semibold text-center">{post.caption}</h3>
                                    <p className="text-sm text-gray-600 mt-1">Posted by {post.postedBy}</p>
                                    <div className="mt-4 flex justify-between">
                                        <button onClick={() => handleEditPost(post._id)} className="text-blue-500 flex items-center">
                                            <FaEdit className="mr-1" /> Edit
                                        </button>
                                        <button onClick={() => handleDeletePost(post._id)} className="text-red-500 flex items-center">
                                            <FaTrashAlt className="mr-1" /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {posts.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => navigate('/create-post')}
                                className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md"
                            >
                                <FaPlusCircle className="mr-2" /> Create New Post
                            </button>
                        </div>
                    )}
                </div>
            )}
            <ImageModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                imageUrl={selectedImage}
            />
        </div>
    );
};

export default Profile;
