import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error(
    "Please set the GEMINI_API_KEY environment variable. You can get one from Google AI Studio."
  );
}

// Intialize gemini
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getGeminiPrediction(symptoms: string) {
  try {
    // We'll use the gemini pro model to send request
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create prompt
    const prompt = `I am building a medical illness prediction tool. I will provide a list of symptoms, and I need you to analyze them and provide a possible illness, along with a possible medications for the patient.

    Here are the symptoms:

    ${symptoms}

    Please provide your response in the following format:

    Illness: [POSSIBLE ILLNESS/CONDITION]
    Medication: [BRIEF PREDICTION/EXPLANATION]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response beause it may contain unwanted things
    const illnessMatch = text.match(/Illness:\s*(.*?)\n/);
    const medicationMatch = text.match(/Medication:\s*(.*?)\n/);

    const illness = illnessMatch ? illnessMatch[1].trim() : null;
    const medications = medicationMatch
      ? medicationMatch[1].split("*").map((item) => item.trim())
      : null;

    const res =  `
        Illness: ${illness}
        \n
        \n
        Medications: ${medications}
    `

    return res

  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return "An error occurred while processing your request.";
  }
}