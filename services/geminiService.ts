
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getInsuranceAdvice = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional Kenyan Insurance Broker. Provide a short, helpful response to this query: ${query}. Focus on local context (Kenyan Shillings, local providers like Britam, Jubilee, APA).`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Advice Error:", error);
    return "I'm currently offline, but generally, it's best to compare at least 3 quotes before deciding on an insurance policy in Kenya.";
  }
};

export const summarizeNews = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this insurance news into a 2-sentence snippet: ${content}`,
    });
    return response.text;
  } catch (error) {
    return content.substring(0, 100) + "...";
  }
};
