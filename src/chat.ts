import * as dotenv from "dotenv";

dotenv.config();

const token = process.env.OPENAI_TOKEN;

if (!token) {
  console.log("you must login first running 'npm run login'");
}

import { ChatGPTAPI } from "chatgpt";

async function askQuestion(sessionToken: string) {
  // sessionToken is required; see below for details
  const api = new ChatGPTAPI({
    sessionToken,
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
askQuestion(token);
