import * as puppeteer from "puppeteer";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const authNToken = await getAuthToken("https://chat.openai.com/chat").catch(
  console.error
);

updateEnvValue("OPENAI_TOKEN", authNToken);

function updateEnvValue(key: string, value: string) {
  const filePath = ".env";

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    // If the file does not exist, create it with the specified key and value
    fs.writeFileSync(filePath, `${key}=${value}`);
    return;
  }

  // Read the file contents into memory
  const fileContents = fs.readFileSync(filePath, { encoding: "utf8" });

  // Split the file into lines and map them to key-value pairs
  const keyValuePairs = fileContents
    .split("\n")
    .map((line) => line.split("="))
    .map(([key, value]) => ({ key, value }));

  // Check if the key already exists in the file
  let keyExists = false;
  keyValuePairs.forEach((pair) => {
    if (pair.key === key) {
      keyExists = true;
    }
  });

  // If the key does not exist, add it to the array of key-value pairs
  if (!keyExists) {
    keyValuePairs.push({ key, value });
  }

  // Update the value for the specified key
  keyValuePairs.forEach((pair) => {
    if (pair.key === key) {
      pair.value = value;
    }
  });

  // Write the key-value pairs back to the file
  fs.writeFileSync(
    filePath,
    keyValuePairs.map((pair) => `${pair.key}=${pair.value}`).join("\n")
  );
}

async function getAuthToken(url: string) {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ headless: false });

  // Create a new page
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto(url);

  // await page.waitForNavigation();

  await page.waitForSelector("button:nth-child(1)");

  await page.click("button:nth-child(1)");

  await page.waitForNavigation();

  // Enter the username and password
  //  await page.type("#username", "my-username");
  //  await page.type("#password", "my-password");

  //await page.waitForNavigation();

  // Get the list of HTTPS cookies
  const cookies = await page.cookies({ https: true });

  // Find the authentication token cookie
  const authCookie = cookies.find(
    (cookie) => cookie.name === "__Secure-next-auth.session-token"
  );

  // Return the value of the authentication token
  return authCookie?.value;
}
