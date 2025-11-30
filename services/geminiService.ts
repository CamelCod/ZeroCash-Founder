import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ChartData } from "../types";

const apiKey = process.env.API_KEY;
// Using gemini-2.5-flash for speed and JSON capability
const MODEL_NAME = 'gemini-2.5-flash'; 

const ai = new GoogleGenAI({ apiKey });

interface GenerateResponse {
  markdownContent: string;
  chart?: ChartData;
}

export const generateBusinessPlan = async (prompt: string): Promise<GenerateResponse> => {
  try {
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        markdownContent: {
          type: Type.STRING,
          description: "The full business plan content in Markdown format."
        },
        chart: {
          type: Type.OBJECT,
          description: "Optional data to visualize a key part of the plan (e.g. Budget split, Growth timeline, Competition analysis).",
          properties: {
            title: { type: Type.STRING, description: "Title of the chart" },
            type: { 
              type: Type.STRING, 
              enum: ["bar", "pie", "line", "area"],
              description: "The best type of chart to represent the data."
            },
            xAxisLabel: { type: Type.STRING },
            yAxisLabel: { type: Type.STRING },
            data: {
              type: Type.ARRAY,
              description: "Data points for the chart. Keep it between 3-8 points for clarity.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Label for the data point (e.g. 'Month 1', 'Website Hosting')" },
                  value: { type: Type.NUMBER, description: "Numerical value" }
                },
                required: ["name", "value"]
              }
            }
          },
          required: ["title", "type", "data"]
        }
      },
      required: ["markdownContent"]
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: `You are an expert business mentor for entrepreneurs starting with exactly $0. 
        Your advice must be highly practical, specific, and actionable. 
        Avoid generic advice like "be passionate." 
        Focus on "how-to" using free tools, organic marketing, and manual hustle.
        
        IMPORTANT: You must return the response in JSON format.
        1. 'markdownContent': The strategy text. Format with headers, bullet points, and bold text.
        2. 'chart': Include one relevant dataset to visualize the strategy. For example:
           - For Finance: A pie chart of 'Hypothetical First $500 Reinvestment'.
           - For Marketing: A bar chart of 'Expected Traffic Sources'.
           - For MVP: A line chart of 'Development Timeline (Weeks)'.
           - For Validation: A bar chart of 'Niche Demand vs Competition'.
        `,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GenerateResponse;
    }
    
    throw new Error("No content generated");
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate plan. Please check your API key and try again.");
  }
};