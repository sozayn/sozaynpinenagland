import { GoogleGenAI, Type } from "@google/genai";
import type { Goal } from '../types';

/**
 * Helper to get a fresh instance of the AI client with the current process.env.API_KEY.
 * Always create a new instance before a call to ensure the user-selected key from aistudio is used.
 */
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a tailored meditation or yoga session based on user energy.
 */
export async function generatePracticeSession(type: 'Meditation' | 'Yoga', energy: string): Promise<any> {
  const ai = getAIClient();
  const prompt = `Create a professional and mystical ${type} session for someone feeling "${energy}". 
  The session should have 3 to 5 steps.
  For each step, provide a clear instruction and a "wisdom mantra" related to ancient philosophy or the cosmos.
  If it's Yoga, give the step a 'poseName'.
  
  Return as JSON:
  {
    "title": "A short poetic title",
    "description": "A one-sentence soulful description",
    "mantra": "A core wisdom quote for the whole session",
    "steps": [
      { "duration": 60, "instruction": "...", "mantra": "...", "poseName": "Optional" }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            mantra: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  duration: { type: Type.NUMBER },
                  instruction: { type: Type.STRING },
                  mantra: { type: Type.STRING },
                  poseName: { type: Type.STRING }
                },
                required: ['duration', 'instruction', 'mantra']
              }
            }
          },
          required: ['title', 'description', 'mantra', 'steps']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error('Error generating practice:', error);
    throw new Error('Cosmic connection interrupted.');
  }
}

/**
 * Fetches a deep cosmic reading (Astrology or Numerology).
 * Uses 'gemini-3-pro-image-preview' for high-quality multi-modal output.
 * We avoid setting a thinking budget here as it can conflict with the image generation part of the pipeline.
 */
export async function getDeepCosmicReading(type: 'Astrology' | 'Numerology', details: any): Promise<{ text: string, imageUrl?: string }> {
  const ai = getAIClient();
  
  const textPrompt = type === 'Astrology' 
    ? `Perform a profound, technically detailed celestial analysis for the following natal data: ${JSON.stringify(details)}. 
       Focus on planetary alignments, karmic lessons, and the soul's current evolutionary stage according to the book "CAN". 
       ALSO: Generate a stunning piece of digital artwork representing this configuration in a high-fantasy, astronomical style. 
       The image should be a 1:1 mystical portal into the deep cosmos.`
    : `Perform a deep numerology analysis for name "${details.name}" and birth date "${details.date}". 
       Explain the Life Path, Expression, and Soul Urge using the 3-6-9 system from the book "CAN". 
       ALSO: Generate an abstract, sacred-geometry inspired digital artwork that visually represents these specific numeric frequencies. 
       The image should be a 1:1 masterpiece of geometric energy.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: textPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      },
    });

    let generatedText = '';
    let generatedImageUrl = '';

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          generatedText += part.text;
        } else if (part.inlineData) {
          generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    return {
      text: generatedText || "The stars are currently clouded. Please seek illumination again shortly.",
      imageUrl: generatedImageUrl
    };
  } catch (error: any) {
    console.error(`Error fetching deep ${type} reading:`, error);
    if (error.message?.includes("Requested entity was not found")) {
        throw new Error("API_KEY_REQUIRED");
    }
    throw new Error(`Failed to get deep ${type} reading.`);
  }
}

/**
 * Fetches a chat response from the model.
 * Uses gemini-3-pro-preview with max thinking budget for complex, philosophical queries.
 */
export async function getChatResponse(
  history: { role: 'user' | 'model', parts: { text: string }[] }[], 
  newMessage: string, 
  thinking: boolean = false
): Promise<string> {
  const ai = getAIClient();
  try {
    const model = thinking ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    const config: any = {
      systemInstruction: 'You are Devatra AI, a guide inspired by the book "CAN" and ancient myths. Your tone is wise, slightly mystical, and illuminating. You help users apply the CAN formula (Collection, Abstraction, Narration) to their lives.'
    };

    if (thinking) {
      config.thinkingConfig = { thinkingBudget: 32768 };
    }

    const chat = ai.chats.create({
      model: model,
      history: history,
      config: config
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || '';

  } catch (error) {
    console.error('Error fetching chat response from Gemini API:', error);
    throw new Error('Failed to get chat response.');
  }
}

// --- GOAL-SETTING AI FUNCTIONS ---

export async function generateAttributesForAspects(aspects: { aspect: string; userInput: string }[]): Promise<{ aspect: string; attributes: { title: string; description: string }[] }[]> {
  const ai = getAIClient();
  const prompt = `Following the principles of the 'CAN' book, generate exactly 6 positive, aspirational attributes for these life aspects.
Life Aspects and Inputs:
${aspects.map(a => `- ${a.aspect}: "${a.userInput || 'General aspirations'}"`).join('\n')}
Return as JSON.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              aspect: { type: Type.STRING },
              attributes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ['title', 'description']
                }
              }
            },
            required: ['aspect', 'attributes']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error('Error generating attributes:', error);
    throw new Error('Failed to generate attributes.');
  }
}

export async function generateGoalsForAspects(aspectsWithAttributes: { aspect: string; attributes: { title: string; description: string }[] }[]): Promise<{ aspect: string; goals: Goal[] }[]> {
  const ai = getAIClient();
  const prompt = `Using the 3-6-9 system from the book 'CAN', generate a diverse list of exactly 18 potential, actionable goals.
${aspectsWithAttributes.map(item => `Aspect: ${item.aspect}\nAttributes: ${item.attributes.map(a => a.title).join(', ')}`).join('\n')}
Return as JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              aspect: { type: Type.STRING },
              goals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ['title', 'description']
                }
              }
            },
            required: ['aspect', 'goals']
          }
        }
      }
    });
    const parsedResponse: { aspect: string; goals: { title: string; description: string }[] }[] = JSON.parse(response.text || '[]');
    return parsedResponse.map(item => ({
        ...item,
        goals: item.goals.map(goal => ({
            ...goal,
            id: `goal_${Math.random().toString(36).substring(2, 9)}`,
            completed: false
        }))
    }));
  } catch (error) {
    console.error('Error generating goals:', error);
    throw new Error('Failed to generate goals.');
  }
}