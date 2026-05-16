const Post = require('../models/Post');

// Tạo bài đăng mới
exports.createPost = async (req, res) => {
    try {
        const { title, quickSummary, description, location, newsLinks, images, category, severity} = req.body;

        const newPost = new Post({
            title,
            description,
            quickSummary,
            location, // Format: { type: "Point", coordinates: [106.x, 10.x] }
            newsLinks,
            images,
            category,
            severity,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo bài đăng", error: error.message });
        console.error("Lỗi tại backened:", error.message);

                res.status(500).json({
                    message: "Lỗi hệ thống không thể lưu dữ liệu",
                    error: error.message
                });
    }
};

// Lấy tất cả bài đăng để hiển thị lên bản đồ
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Lấy hết và xếp bài mới lên đầu
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error: error.message });
    }
};

//Thêm bình luận vào
exports.addComment = async (req, res) => {
    try {
        const { text, userName } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Không tìm thấy địa điểm" });
        post.comments.push({
            user: userName || "Cư dân ẩn danh",
            text: text
        });

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Lỗi bình luận" , error: error.message });
    }
};

// Chỉ lấy những bài đã được duyệt hoặc đã xử lý xong
exports.getPublicPosts = async (req, res) => {
    try {
        const posts = await Post.find({ status: { $in: ['verified', 'resolved'] } });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy dữ liệu" });
    }
};

// cập nhật trạng thái bài đăng ( feature của admin )
exports.updateStatus = async (req, res) => {
    try {
       const { status } = req.body; // 'verified' hoặc 'resolved'
       const post = await Post.findByIdAndUpdate(
           req.params.id,
           { status },
           { new: true } // Trả về dữ liệu mới nhất sau khi sửa
       );

       if (!post) return res.status(404).json({ message: "Không tìm thấy địa điểm" });
       res.status(200).json(post);
   }
   catch (error) {
       res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: error.message });
   }
};

//xoá bài báo cáo
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Không tìm thấy địa điểm cần xóa" });
        }
        res.status(200).json({ message: "Đã dọn dẹp và xóa báo cáo khỏi hệ thống thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa dữ liệu", error: error.message });
    }
};