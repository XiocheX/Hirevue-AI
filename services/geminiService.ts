
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResult, ResearchResult, UserTier } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeResume = async (resumeText: string, jobDescription: string, tier: UserTier): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  // PRO users get the high-reasoning Pro model, FREE users get the faster Flash model
  const model = tier === UserTier.PRO ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analyze this resume against the following job description. 
    Resume: ${resumeText}
    Job Description: ${jobDescription}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Match score from 0-100" },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.STRING, description: "Actionable advice" }
        },
        required: ["score", "strengths", "improvements", "suggestions"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const researchCompany = async (companyName: string): Promise<ResearchResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Research ${companyName}. Focus on recent news, culture, and key products. Provide a concise summary.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const summary = response.text || "No summary available.";
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || "Untitled",
    uri: chunk.web?.uri || "#"
  })) || [];

  return { summary, sources };
};

// Encoding/Decoding Helpers for Live API
export const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const encode = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
