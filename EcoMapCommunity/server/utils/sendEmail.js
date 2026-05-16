const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Tạo transporter (Cấu hình máy chủ gửi mail)
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER, // Email trong .env)
            pass: process.env.EMAIL_PASS  // Password gmail trong .env)
        }
    });

    // 2. Định nghĩa nội dung Email
    const mailOptions = {
        from: '"EcoMap Community" <noreply@ecomap.com>',
        to: options.email,
        subject: options.subject,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e8d5c4; border-radius: 15px; background-color: #fdfbf7;">
                <h2 style="color: #5f8575; text-align: center;">Chào mừng bạn đến với EcoMap! 🌿</h2>
                <p style="color: #434242; line-height: 1.6;">Cảm ơn bạn đã đồng hành cùng cộng đồng bảo vệ môi trường. Để hoàn tất đăng ký, hãy sử dụng mã xác thực dưới đây:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #5f8575; border-bottom: 2px dashed #e8d5c4; padding-bottom: 5px;">${options.otp}</span>
                </div>
                <p style="color: #888; font-size: 12px; text-align: center;">Mã này sẽ hết hạn sau 10 phút.</p>
                <hr style="border: 0; border-top: 1px solid #e8d5c4; margin: 20px 0;">
                <p style="text-align: center; color: #5f8575; font-style: italic;">"Cùng nhau, chúng ta làm cho thế giới xanh hơn."</p>
            </div>
        `
    };

    // 3. Gửi mail thực tế
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;