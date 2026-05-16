const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Lấy token từ header "Authorization"
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Không có token, quyền truy cập bị từ chối" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eco_map_secret_key');
        req.user = decoded; // Lưu thông tin user vào request để dùng ở các bước sau
        next();
    } catch (err) {
        res.status(401).json({ message: "Token không hợp lệ" });
    }
};