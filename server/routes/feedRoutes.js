const express = require("express");
const { createPost, getAllPosts, getUserPosts, updatePost, deletePost, getPostById } = require('../controllers/feedController');
const verifyToken = require('../middlewares/authMiddleware');
const multer = require('multer');

// Setup multer for handling file uploads
const upload = multer();

const router = express.Router();

// Route to fetch all posts 
router.get('/', getAllPosts);

// Route to fetch posts for the authenticated user (requires authentication)
router.get('/user', verifyToken, getUserPosts);

// Route to create a new post (requires authentication)
router.post('/', verifyToken, upload.none(), createPost);

// Route to update a post (requires authentication)
router.put('/:postId', verifyToken, updatePost);

router.get('/:postId', getPostById);

// Route to delete a post (requires authentication)
router.delete('/:postId', verifyToken, deletePost);

module.exports = router;
