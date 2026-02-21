import { GoogleGenAI, Type } from "@google/genai";
import { Mood } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeMood = async (input: string): Promise<{ mood_label: Mood; confidence: number; reason: string }> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are the core Emotion Intelligence Engine for MindShift AI. 
    Your task is to classify the user's emotional state based on their input (text or speech transcript).
    
    PREDEFINED MOOD CATEGORIES:
    - Sad
    - Bored
    - Angry
    - Horny
    - Lonely
    - Procrastinating
    - Want to Watch Movie
    - Happy
    - Tired
    - Neutral
    - Excited

    CLASSIFICATION RULES:
    1. Analyze the tone, keywords, and underlying sentiment.
    2. Select the most accurate mood from the predefined list.
    3. Provide a confidence score (0.0 to 1.0).
    4. Give a brief, empathetic reason for your choice.

    User Input: "${input}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mood_label: {
            type: Type.STRING,
            description: "The classified mood label from the predefined list."
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score from 0.0 to 1.0."
          },
          reason: {
            type: Type.STRING,
            description: "A short explanation for the classification."
          }
        },
        required: ["mood_label", "confidence", "reason"]
      }
    }
  });

  return JSON.parse(response.text);
};

const FALLBACK_INTERVENTIONS: Record<string, any> = {
  'Sad': {
    type: 'quote',
    title: 'A Gentle Reminder',
    content: 'This too shall pass. You are stronger than you feel right now.',
    action_label: 'Take a deep breath'
  },
  'Angry': {
    type: 'exercise',
    title: 'Cool Down',
    content: 'Count backwards from 10. Feel the air entering your lungs.',
    action_label: 'I am calm'
  },
  'Happy': {
    type: 'task',
    title: 'Share the Joy',
    content: 'Send a quick "thinking of you" text to a friend.',
    action_label: 'Done'
  },
  'default': {
    type: 'quote',
    title: 'Stay Present',
    content: 'Focus on the next small step. You are doing great.',
    action_label: 'Continue'
  }
};

export const getIntervention = async (mood: Mood, context?: string): Promise<{
  type: 'joke' | 'song' | 'quote' | 'exercise' | 'task' | 'self-control';
  title: string;
  content: string;
  action_label: string;
  metadata?: {
    artist?: string;
    duration?: string;
    language?: string;
    search_query?: string;
    reason?: string;
  };
}> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Content Generation Module for MindShift AI.
      Generate a highly personalized intervention for a user in the "${mood}" mood.
      ${context ? `User context: "${context}"` : ''}

      CONTENT TYPE SPECIFICATIONS:
      1. JOKE: Short, witty, and universally funny. Tone: Lighthearted.
      2. SONG: A popular Hindi song. 
         - For Sad: Soulful/Arijit Singh.
         - For Happy/Excited: Party/Bhangra.
         - For Angry: Sufi/Calm.
         - For Horny: Romantic/Sensual.
         - For Lonely: Nostalgic/Acoustic.
         - For Bored: 90s Hits/Indie Pop.
         - For Procrastinating: Motivational/Focus.
         - For Tired: Meditative/Soft.
         Provide song_name, artist, and a YouTube search_query.
      3. QUOTE: A deep, inspirational quote in Hindi (Hinglish) or English.
      4. EXERCISE: A mindfulness or grounding task.
      5. TASK: A quick productivity nudge or physical movement.
      6. SELF-CONTROL: A psychological dialogue or technique to manage urges (especially for 'Horny', 'Angry', or 'Procrastinating' moods). Tone: Supportive and firm. Content must include a strong "Why" to stay in control and suggest 3 specific alternatives (e.g., drink water, walk, pushups). Action label: "Start 20s Challenge".

      Return a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            action_label: { type: Type.STRING },
            metadata: {
              type: Type.OBJECT,
              properties: {
                artist: { type: Type.STRING },
                search_query: { type: Type.STRING, description: "YouTube search query string" },
                reason: { type: Type.STRING, description: "Why this song fits the mood" },
                language: { type: Type.STRING }
              }
            }
          },
          required: ["type", "title", "content", "action_label"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Intervention Error:", error);
    return FALLBACK_INTERVENTIONS[mood] || FALLBACK_INTERVENTIONS['default'];
  }
};
