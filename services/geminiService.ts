
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Standard initialization helper using process.env.API_KEY
const getAIInstance = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not defined in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getInsuranceAdvice = async (query: string) => {
  try {
    const ai = getAIInstance();
    if (!ai) return "I'm currently unable to access my expert database. Please try again later.";

    // Use gemini-3-pro-preview for complex reasoning tasks like financial advice
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a professional Kenyan Insurance Broker. Provide a short, helpful response to this query: ${query}. Focus on local context (Kenyan Shillings, local providers like Britam, Jubilee, APA).`,
    });
    // response.text is a property, not a method
    return response.text || "I'm sorry, I couldn't generate advice right now.";
  } catch (error) {
    console.error("AI Advice Error:", error);
    return "Generally, it's best to compare at least 3 quotes before deciding on an insurance policy in Kenya. Our advisors can help you more directly via the contact page.";
  }
};

export const summarizeNews = async (content: string) => {
  try {
    const ai = getAIInstance();
    if (!ai) return content.substring(0, 100) + "...";

    // Use gemini-3-flash-preview for lightweight summarization tasks
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize this insurance news into a 2-sentence snippet: ${content}`,
    });
    // response.text is a property, not a method
    return response.text || content;
  } catch (error) {
    return content.substring(0, 100) + "...";
  }
};
