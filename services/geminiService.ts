import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
// Using gemini-2.5-flash for speed and efficiency in generating text plans
const MODEL_NAME = 'gemini-2.5-flash'; 

const ai = new GoogleGenAI({ apiKey });

export const generateBusinessPlan = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: `You are an expert business mentor for entrepreneurs starting with exactly $0. 
        Your advice must be highly practical, specific, and actionable. 
        Avoid generic advice like "be passionate." 
        Focus on "how-to" using free tools, organic marketing, and manual hustle.
        Format your response in clean Markdown with headers, bullet points, and bold text for emphasis.`,
        temperature: 0.7, // Balance creativity with structure
      }
    });

    return response.text || "No content generated. Please try again.";
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate plan. Please check your API key and try again.");
  }
};