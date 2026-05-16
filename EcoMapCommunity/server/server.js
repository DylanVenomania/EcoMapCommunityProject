const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Để đọc được dữ liệu JSON từ request body

// Kết nối MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('✅ Đã kết nối thành công tới MongoDB Atlas (EcoMapDB)'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Route kiểm tra cơ bản
app.get('/', (req, res) => {
    res.send('Server EcoMapCommunity đang hoạt động!');
});
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', require('./routes/postRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại port: ${PORT}`);
});