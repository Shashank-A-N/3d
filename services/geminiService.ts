
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeCharacterImage = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `Analyze this character image and provide a technical 3D modeling blueprint. 
  Output the result as a JSON object matching the requested schema. 
  Include details about the materials, colors, and specific geometry features.
  The 'blueprint' field should be a long-form markdown description of how to model this in ZBrush or Blender.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          config: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              material: { type: Type.STRING, enum: ['metallic', 'matte', 'glowing'] },
              primaryColor: { type: Type.STRING, description: 'Hex color' },
              secondaryColor: { type: Type.STRING, description: 'Hex color' },
              description: { type: Type.STRING },
              complexity: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } },
              lighting: { type: Type.STRING, enum: ['dramatic', 'soft', 'eerie'] }
            },
            required: ['name', 'material', 'primaryColor', 'secondaryColor', 'description', 'features']
          },
          blueprint: { type: Type.STRING }
        },
        required: ['config', 'blueprint']
      }
    }
  });

  const text = response.text;
  try {
    return JSON.parse(text) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response", text);
    throw new Error("Invalid response format from AI");
  }
};
