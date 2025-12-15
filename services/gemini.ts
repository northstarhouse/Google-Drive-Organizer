import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysis } from "../types";

// Initialize Gemini
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      description: "A single broad category for the image (e.g., Nature, People, Food, Architecture, Pets, Documents, Tech, Abstract).",
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 specific keywords describing the image content.",
    },
    summary: {
      type: Type.STRING,
      description: "A very brief, one-sentence caption of the image.",
    },
    season: {
      type: Type.STRING,
      enum: ["Spring", "Summer", "Autumn", "Winter", "Indoor/Unknown"],
      description: "Estimated season based on visual cues, or Indoor/Unknown if not applicable.",
    },
  },
  required: ["category", "tags", "summary"],
};

export const analyzeImageContent = async (base64Data: string, mimeType: string): Promise<AIAnalysis> => {
  try {
    const modelId = "gemini-2.5-flash"; // Efficient for high-volume image tasks

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: "Analyze this image for a photo organization app. Classify it into a broad category and provide specific tags.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more consistent categorization
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Return a fallback so the app doesn't crash, but mark it generic
    return {
      category: "Uncategorized",
      tags: [],
      summary: "Could not analyze image.",
      season: "Indoor/Unknown",
    };
  }
};
