const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const summarizeNews = async (description) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Bạn là một chuyên gia môi trường. Hãy tóm tắt nội dung sau đây thành một đoạn ngắn khoảng 3 câu, tập trung vào vấn đề ô nhiễm và địa điểm: ${description}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Lỗi Gemini AI:", error);
        return "Không thể tóm tắt nội dung này do lỗi kỹ thuật.";
    }
};

module.exports = { summarizeNews };