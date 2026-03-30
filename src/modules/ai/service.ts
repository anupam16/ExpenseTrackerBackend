import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateExpenseSummary = async (summaryData: any) => {
  const prompt = `
    Summarize this monthly expense data:
    ${JSON.stringify(summaryData)}
    Give short financial insight.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    console.log("AI Response:", response.text);
    return response.text;
  } catch (error: any) {
    console.error("Gemini SDK Error:", error.message);
    throw new Error("Failed to generate expense summary");
  }
};
