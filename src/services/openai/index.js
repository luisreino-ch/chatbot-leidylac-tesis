import OpenAI from "openai";
import { generatePrompt, generatePromptDetermine } from "./prompt";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


//gpt-3.5-turbo-0125

const run = async (name, history) => {

  const prompt = generatePrompt(name)
  console.log(`[PROMPT]:`,prompt)

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": prompt
      },
      ...history
    ],
    temperature: 1,
    max_tokens: 800,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  // retornamos la respuesta generada por OpenAI
  return response.choices[0].message.content
}



const runDetermine = async (history) => {

  const prompt = generatePromptDetermine()
  console.log(`[PROMPT]:`,prompt)

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "system",
        "content": prompt
      },
      ...history
    ],
    temperature: 1,
    max_tokens: 800,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  // retornamos la respuesta generada por OpenAI
  return response.choices[0].message.content
}



export {run, runDetermine}

