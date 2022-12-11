import * as puppeteer from "puppeteer";

async function getAuthToken(url: string) {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ headless: false });

  // Create a new page
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto(url);

  await page.waitForNavigation();

  //await page.waitForSelector('button:contains("Log in")');

  await page.waitForXPath('//button[contains(text(), "Log in")]');

  // await page.click('button:contains("Log in")');

  // Get a reference to the "Log in" button
  const loginButton = await page.$x('//button[contains(text(), "Log in")]');

  // Click on the "Log in" button
  await loginButton[0].click();

  // Enter the username and password
  //  await page.type("#username", "my-username");
  //  await page.type("#password", "my-password");

  // Click the login button
  //await page.click("#login-button");

  // Wait for the page to load
  await page.waitForNavigation();

  // Get the list of HTTPS cookies
  const cookies = await page.cookies({ https: true });

  // Find the authentication token cookie
  const authCookie = cookies.find((cookie) => cookie.name === "auth-token");

  // Return the value of the authentication token
  return authCookie.value;
}

getAuthToken("https://chat.openai.com/chat").catch(console.error);
