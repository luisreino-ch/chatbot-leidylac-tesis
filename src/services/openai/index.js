import 'dotenv/config';
import OpenAI from "openai";
import { generatePrompt, generatePromptDetermine } from "./prompt.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Utilizar un modelo eficiente y económico
const MODEL = "gpt-3.5-turbo";

// Función para llamar a la API de OpenAI
const callOpenAI = async (prompt, history) => {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          "role": "system",
          "content": prompt
        },
        // Solo incluir los últimos 3 mensajes del historial para ahorrar tokens
        ...history.slice(-3)
      ],
      temperature: 0.7,
      max_tokens: 300,  // Limitar el número de tokens en la respuesta
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    } else {
      throw new Error("No valid response from OpenAI");
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return "Error processing your request. Please try again.";
  }
};

const run = async (name, history) => {
  const prompt = generatePrompt(name);
  console.log(`[PROMPT]:`, prompt);
  return await callOpenAI(prompt, history);
};

const runDetermine = async (history) => {
  const prompt = generatePromptDetermine();
  console.log(`[PROMPT]:`, prompt);
  return await callOpenAI(prompt, history);
};

export { run, runDetermine };
