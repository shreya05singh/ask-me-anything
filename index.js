
const Groq=require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY,
 });

 async function main(msg) {
  const chatCompletion = await getGroqChatCompletion(msg);
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

 async function getGroqChatCompletion(msg) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: msg,
      },
    ],
    model: "llama3-8b-8192",
  });
}

main("write about virat kolhi");