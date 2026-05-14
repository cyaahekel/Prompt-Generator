import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeImage(base64Image: string, mimeType: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this image and describe it in detail according to the following categories. 
          Respond in JSON format with these keys: 
          - subject: Detail about the main person or object.
          - angle: Camera angle, framing, and composition.
          - outfit: Clothing and accessories.
          - pose: Body pose and facial expression.
          - environment: Background and surroundings.
          - lighting: Lighting style and shadows.
          - style: Photography or cinematic style.
          
          The descriptions should be artistic and cinematic, suitable for an AI image generator prompt.`,
          }
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            angle: { type: Type.STRING },
            outfit: { type: Type.STRING },
            pose: { type: Type.STRING },
            environment: { type: Type.STRING },
            lighting: { type: Type.STRING },
            style: { type: Type.STRING },
          },
          required: ["subject", "angle", "outfit", "pose", "environment", "lighting", "style"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
}

export async function remixPrompt(originalPrompt: string, flavor: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional AI Prompt Engineer. 
          Original Prompt:
          ${originalPrompt}
          
          Rewrite this prompt to have a "${flavor}" flavor. 
          Maintain the same structure (subject, angle, etc.) but change the descriptive words to match the flavor.
          Respond with the full formatted prompt only.`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Remix Error:", error);
    throw error;
  }
}

export function formatPrompt(details: any, options?: { ar?: string, extraStyle?: string }) {
  let prompt = `Make picture ultra-realistic

subject:
${details.subject}

Angle kamera/framing:
${details.angle}

Outfit:
${details.outfit}

pose:
${details.pose}

environment:
${details.environment}

lighting:
${details.lighting}

Final style:
${details.style}${options?.extraStyle ? ` + ${options.extraStyle}` : ''}

Negative Prompt:
worst quality, low quality, blurry, ugly, distorted, deformed, watermark, bad anatomy, bad hands, extra limbs, unnatural skin, uncanny valley`;

  if (options?.ar) {
    prompt += ` --ar ${options.ar}`;
  }

  return prompt;
}
