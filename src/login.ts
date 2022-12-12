import * as dotenv from "dotenv";
import { updateEnvValue } from "./updateEnvValue";
import { getAuthToken } from "./getAuthToken";

dotenv.config();

const authTokenSubject$ = await getAuthToken("https://chat.openai.com/chat", {
  user: process.env.OPENAI_USERNAME,
  password: process.env.OPENAI_PASSWORD,
}).catch(console.log);

authTokenSubject$.subscribe((token: string) => {
  console.log("write new token to .env OPENAI_TOKEN");
  updateEnvValue("OPENAI_TOKEN", token);
});
