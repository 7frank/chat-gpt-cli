import * as dotenv from "dotenv";
import { updateEnvValue } from "./updateEnvValue";
import { getAuthToken } from "./getAuthToken";

dotenv.config();

const authTokenValue = await getAuthToken("https://chat.openai.com/chat", {
  user: process.env.OPENAI_USERNAME,
  password: process.env.OPENAI_PASSWORD,
});

updateEnvValue("OPENAI_TOKEN", authTokenValue);
