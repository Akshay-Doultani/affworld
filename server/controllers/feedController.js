const Post = require('../models/Post');

// Fetch posts by a specific user
const getUserPosts = async (req, res) => {
    try {
        console.log("User ID:", req.user.id);
        const posts = await Post.find({ user: req.user.id })
            .populate('user', 'username')
            .exec();

        if (!posts.length) {
            return res.status(404).json({ message: 'No posts found for this user.' });
        }
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: 'Failed to fetch user posts', error });
    }
};


// Fetch all posts with user details
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username').exec();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts', error });
    }
};

const getPostById = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch post', error });
    }
};

const createPost = async (req, res) => {
    const { caption, imageUrl, cloudinaryId, userId, postedBy } = req.body;

    if (!caption || !imageUrl || !cloudinaryId || !userId) {  // Ensure all fields are present
        return res.status(400).json({ message: "Caption, image URL, Cloudinary ID, and User ID are required." });
    }



    try {
        const newPost = new Post({
            caption,
            imageUrl,
            cloudinaryId,
            user: userId,
            postedBy,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post', error });
    }
};





// Update a post
const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { caption, imageUrl, cloudinaryId, } = req.body;

    try {
        console.log('Received data:', { caption, imageUrl, cloudinaryId });

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You can only update your own posts' });
        }

        if (caption) {
            post.caption = caption;
        }

        if (imageUrl) {
            post.imageUrl = imageUrl;
        }

        if (cloudinaryId) {
            post.cloudinaryId = cloudinaryId;
        }

        console.log('Updated post:', post);

        await post.save();
        res.status(200).json(post); // Ensure the updated post is returned
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Failed to update post', error });
    }
};



// Delete a post
const deletePost = async (req, res) => {
    const { postId } = req.params;

    try {
        console.log(`Attempting to delete post with ID: ${postId}`);

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You can only delete your own posts' });
        }

        await Post.findByIdAndDelete(postId);
        console.log('Post deleted successfully');
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Failed to delete post', error });
    }
};




module.exports = { getAllPosts, createPost, updatePost, deletePost, getUserPosts, getPostById };
