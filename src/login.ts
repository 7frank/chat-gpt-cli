import * as dotenv from "dotenv";
import { updateEnvValue } from "./updateEnvValue";
import { getAuthToken } from "./getAuthToken";
import {
  command,
  run,
  string,
  number,
  positional,
  option,
  flag,
  boolean,
} from "cmd-ts";

dotenv.config();

const cmd = command({
  name: "login",
  description: "login to openai",
  version: "1.0.0",
  args: {
    passiveMode: flag({
      type: boolean,
      short: "p",
      long: "passive",
    }),
  },
  handler: async (args) => {
    const authTokenSubject$ = await getAuthToken(
      "https://chat.openai.com/chat",
      {
        user: process.env.OPENAI_USERNAME,
        password: process.env.OPENAI_PASSWORD,
        passiveMode: args.passiveMode,
      }
    ).catch(console.log);

    authTokenSubject$?.subscribe(
      ({ sessionToken, clearanceToken, userAgent }) => {
        console.log("update .env OPENAI_*");
        updateEnvValue("OPENAI_SESSION_TOKEN", sessionToken);
        updateEnvValue("OPENAI_CLEARANCE_TOKEN", clearanceToken);
        updateEnvValue("OPENAI_USER_AGENT", userAgent);
      }
    );
  },
});

run(cmd, process.argv.slice(2));
