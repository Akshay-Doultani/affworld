import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaCloudUploadAlt, FaArrowLeft } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const PostForm = () => {
    const { user } = useContext(AuthContext);
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [cloudinaryId, setCloudinaryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { postId } = useParams();
    const navigate = useNavigate();

    // If postId exists, it means we're updating an existing post
    useEffect(() => {
        if (postId) {
            fetchPostDetails(postId);
        }
    }, [postId]);

    const fetchPostDetails = async (postId) => {
        try {
            const response = await API.get(`/feed/${postId}`);
            setCaption(response.data.caption);
            setImageUrl(response.data.imageUrl);
            setCloudinaryId(response.data.cloudinaryId);
        } catch (err) {
            setError('Failed to fetch post details.');
        }
    };

    // Handle form submission for creating or updating a post
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!caption || !imageUrl || !cloudinaryId) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token provided. Please log in again.');
            setLoading(false);
            return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken?.id;

        if (!userId) {
            setError('User ID is missing. Please log in again.');
            setLoading(false);
            return;
        }

        const data = {
            caption,
            imageUrl,
            cloudinaryId,
            userId,
            postedBy: user.name,
        };

        try {
            let url = '/feed';
            let method = 'POST';

            if (postId) {
                url = `/feed/${postId}`;
                method = 'PUT';
            }

            const response = await API({
                method,
                url,
                data,
            });

            setLoading(false);

            if (response.status === 200 || response.status === 201) {
                navigate('/profile');
            } else {
                setError(response.data.message || 'Failed to create/update post');
            }
        } catch (error) {
            setLoading(false);
            setError('Failed to submit post');
        }
    };

    // Handle image upload to Cloudinary
    const handleImageUpload = async (file) => {
        setImage(file);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'my_preset');

        try {
            const response = await API.post('https://api.cloudinary.com/v1_1/dtxd8vy60/image/upload', formData);
            const { url, public_id } = response.data;
            setImageUrl(url);
            setCloudinaryId(public_id);
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image');
        }
    };

    // Integrate react-dropzone for drag-and-drop functionality
    const onDrop = (acceptedFiles) => {
        handleImageUpload(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

    return (
        <div className="container mx-auto p-6 max-w-md">
            <button
                onClick={() => navigate('/profile')}
                className="text-blue-500 flex items-center mb-6"
            >
                <FaArrowLeft className="mr-2" /> Back to Profile
            </button>
            <h1 className="text-4xl font-bold mb-6 text-center">{postId ? 'Update Post' : 'Create Post'}</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="caption" className="block text-sm font-medium">Caption</label>
                    <input
                        type="text"
                        id="caption"
                        name="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium">Image</label>
                    <div
                        {...getRootProps()}
                        className="w-full p-6 border-2 border-dashed rounded-md cursor-pointer focus:outline-none focus:ring focus:border-blue-300"
                    >
                        <input {...getInputProps()} />
                        <p className="text-center text-gray-500">Drag & drop an image here, or click to select one</p>
                        {imageUrl && <img src={imageUrl} alt="Post" className="w-full h-48 object-cover mt-4 rounded-md" />}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-md flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : postId ? 'Update Post' : 'Create Post'}
                    <FaCloudUploadAlt className="ml-2" />
                </button>
            </form>
        </div>
    );
};

export default PostForm;
