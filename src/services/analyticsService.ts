import { GoogleGenAI, Type } from "@google/genai";
import { MoodEntry, MoodInsights, Habit } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateMoodInsights = async (history: MoodEntry[], habits?: Habit[]): Promise<MoodInsights> => {
  if (history.length === 0) {
    throw new Error("No history to analyze");
  }

  const historyString = history.map(h =>
    `[${new Date(h.timestamp).toLocaleString()}] Mood: ${h.mood}, Note: ${h.note}, Intensity: ${h.intensity}`
  ).join('\n');

  const habitsString = habits ? habits.map(h =>
    `Habit: ${h.name}, Completed Days: ${h.completedDays.length}`
  ).join('\n') : 'No habit data';

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are the MindShift AI Analytics Engine. 
    Analyze the following mood history and habit data to provide deep insights.
    
    Mood History:
    ${historyString}
    
    Habit Data:
    ${habitsString}
    
    Calculate:
    1. Productivity Score (0-100) based on moods and habit completion.
    2. Discipline Index (0-100) based on habit consistency and self-control triggers.
    3. Dominant Mood.
    4. Patterns (e.g., "You feel tired every evening").
    5. Recommendations for improving flow and discipline.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          dominantMood: { type: Type.STRING },
          productivityScore: { type: Type.NUMBER },
          disciplineIndex: { type: Type.NUMBER },
          patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "dominantMood", "productivityScore", "disciplineIndex", "patterns", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text);
};
