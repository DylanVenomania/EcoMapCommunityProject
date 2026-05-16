const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/public', postController.getPublicPosts); // Route cho người dùng

router.get('/admin/all', postController.getAllPosts); // Route cho Admin (lấy hết cả pending)
router.patch('/:id/status', authMiddleware, postController.updateStatus)// Route để Admin duyệt
router.post('/:id/comment', postController.addComment)

module.exports = router;