const Post = require('../models/Post');
const { summarizeNews } = require('../utils/aiHelper');

// Tạo bài đăng mới
exports.createPost = async (req, res) => {
    try {
        const { title, description, location, newsLinks, images } = req.body;

        // Gọi AI để tóm tắt dựa trên mô tả người dùng gửi hoặc nội dung bài báo
        const summary = await summarizeNews(description);

        const newPost = new Post({
            title,
            description,
            aiSummary: summary,
            location, // Format: { type: "Point", coordinates: [106.x, 10.x] }
            newsLinks,
            images
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo bài đăng", error: error.message });
    }
};

// Lấy tất cả bài đăng để hiển thị lên bản đồ
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error: error.message });
    }
};