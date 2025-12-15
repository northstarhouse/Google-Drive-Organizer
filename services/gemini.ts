import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysis } from "../types";

// Helper to safely get the API key
const getApiKey = () => {
  // Check if process is defined (it might not be in pure browser envs)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // If no key is found, we can't initialize. 
  // We'll throw at call time rather than load time to allow UI to render.
  return ""; 
};

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
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error("API_KEY is missing from environment variables.");
    }

    // Initialize lazily to prevent top-level crashes
    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-2.5-flash";

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
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AIAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      category: "Uncategorized",
      tags: [],
      summary: "Analysis failed or pending config.",
      season: "Indoor/Unknown",
    };
  }
};
