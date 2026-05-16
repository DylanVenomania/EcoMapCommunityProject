const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
// Đăng ký
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Kiểm tra email đã tồn tại chưa
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email đã được sử dụng" });

        // Tạo mã OTP 6 số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // Hết hạn sau 10p

        // 2. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Tạo user mới
        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpires
        });
        await user.save();

        // Gửi mail và roll back nếu lỗi
        try {
            await sendEmail({
                email: user.email,
                subject: 'Mã xác thực tài khoản EcoMap',
                otp: otp
            });
            res.status(200).json({ message: "Mã OTP đã được gửi vào email của bạn!" });
        } catch (err) {
            console.error("Lỗi gửi bài toán SMTP:", err);

            // Xóa User vừa tạo nếu không gửi được Email
            await User.findByIdAndDelete(user._id);

            return res.status(500).json({ message: "Không thể gửi email xác thực. Vui lòng thử lại." });
        }

    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

// Xác thực OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() } // Kiểm tra mã chưa hết hạn
        });

        if (!user) {
            return res.status(400).json({ message: "Mã OTP không đúng hoặc đã hết hạn" });
        }

        // Xác thực thành công
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Xác thực tài khoản thành công! Bây giờ bạn có thể đăng nhập." });
    } catch (err) {
        res.status(500).json({ message: "Lỗi xác thực" });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Kiểm tra user có tồn tại không
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Thông tin đăng nhập không chính xác" });

        if (!user.isVerified) {
            return res.status(401).json({ message: "Vui lòng xác thực email trước khi đăng nhập" });
        }

        // 2. So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Thông tin đăng nhập không chính xác" });

        // 3. Tạo JWT Token (Thẻ thông hành)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'eco_map_secret_key',
            { expiresIn: '1d' } // Token có hạn 1 ngày
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};