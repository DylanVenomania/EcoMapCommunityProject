const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/public', postController.getPublicPosts); // Route cho người dùng

router.get('/admin/all', postController.getAllPosts); // Route cho Admin (lấy hết cả pending)
router.patch('/:id/status', authMiddleware, postController.updateStatus)// Route để Admin duyệt
router.post('/:id/comment', authMiddleware, postController.addComment);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;