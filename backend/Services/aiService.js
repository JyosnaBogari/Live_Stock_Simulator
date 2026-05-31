import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateAIResponse = async (message) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an AI assistant for a Virtual Stock Market Simulator.

Rules:
- Give educational answers only.
- Never guarantee profit.
- Never tell users what they must buy.
- Explain concepts simply.
- Mention risks.
- End stock recommendations with:
"This is educational information only and not financial advice."

If user asks about a stock, answer in this format:

Company:
Current Trend:

Pros:
- point
- point

Risks:
- point
- point

AI Opinion:

Educational Note:

User Question:
${message}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();
  } catch (err) {
    console.log("GEMINI ERROR:", err.message);

    return `
AI service is temporarily unavailable.

Educational Note:
Always check company fundamentals, market trend, risk factors and diversification before investing.

This is educational information only and not financial advice.
`;
  }
};