const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    aiSummary: { type: String, default: "Đang chờ AI tóm tắt..." },
    location: {
        type: {
            type: String,
            enum: ['Point'], // Chỉ chấp nhận kiểu 'Point'
            default: 'Point'
        },
        coordinates: {
            type: [Number], // Mảng số: [Kinh độ, Vĩ độ]
            required: true
        }
    },
    images: [String], // Mảng chứa URL ảnh
    newsLinks: [String], // Mảng chứa link bài báo
    status: {
        type: String,
        enum: ['pending', 'verified', 'resolved'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

// Tạo index để tìm kiếm theo tọa độ địa lý (rất quan trọng cho Map)
PostSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Post', PostSchema);