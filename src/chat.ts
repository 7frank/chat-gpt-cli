import * as dotenv from "dotenv";

dotenv.config();

const sessionToken = process.env.OPENAI_SESSION_TOKEN;

if (!sessionToken) {
  console.log("you must login first running 'npm run login'");
}

import { ChatGPTAPI } from "chatgpt";

async function askQuestion(sessionToken: string) {
  // sessionToken is required; see below for details

  console.log(process.env.OPENAI_USER_AGENT);
  return;
  const api = new ChatGPTAPI({
    sessionToken,
    clearanceToken: process.env.OPENAI_CLEARANCE_TOKEN!,
    userAgent: process.env.OPENAI_USER_AGENT!,
  });

  //console.log("ensureAuth");
  // ensure the API is properly authenticated
  await api.ensureAuth();

  //console.log("sendMessage");
  // send a message and wait for the response
  const response = await api.sendMessage("how are you?");

  //console.log("response");
  // response is a markdown-formatted string
  console.log(response);
}
// console.log(token);
askQuestion(sessionToken);
