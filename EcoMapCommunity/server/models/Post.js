const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    quickSummary: { type: String, required: true },
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
    createdAt: { type: Date, default: Date.now },
    comments: [{
            user: { type: String, default: "Cư dân ẩn danh" },
            text: String,
            createdAt: { type: Date, default: Date.now }
        }],
    category: {
        type: String,
        enum: ['Rác thải đô thị', 'Ô nhiễm nguồn nước', 'Khác'],
        default: 'Rác thải đô thị'
    },
    severity: {
        type: String,
        enum: ['Nhẹ / Mới phát sinh', 'Trung bình', 'Nghiêm trọng'],
        default: 'Trung bình'
    },
});

// Tạo index để tìm kiếm theo tọa độ địa lý
PostSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Post', PostSchema);