import * as puppeteer from "puppeteer";

interface AuthOptions {
  user?: string;
  password?: string;
  authTokenKey?: string;
}
export async function getAuthToken(
  url: string,
  {
    user,
    password,
    authTokenKey = "__Secure-next-auth.session-token",
  }: AuthOptions
) {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ headless: false });

  // Create a new page
  const page = await browser.newPage();
  // wait 2 minutes at max
  await page.setDefaultNavigationTimeout(120000);
  await page.setDefaultTimeout(120000);

  // Navigate to the website
  await page.goto(url);

  // await page.waitForNavigation();
  await page.waitForSelector("button:nth-child(1)");

  await page.click("button:nth-child(1)");

  await page.waitForNavigation();

  // Enter the username and password
  if (user) {
    await page.waitForSelector("#username");
    await page.type("#username", user);
    await page.click("[type=submit]");
  }

  if (password) {
    await page.waitForSelector("#password");
    await page.type("#password", password);
    await page.click("[type=submit]");
  }

  //await page.waitForNavigation();
  await page.waitForFunction("window.location.pathname == '/chat'");
  await page.waitForNavigation();
  console.log("login complete");

  // Get the list of HTTPS cookies
  const cookies = await page.cookies();

  // Find the authentication token cookie
  const authCookie = cookies.find((cookie) => cookie.name === authTokenKey);

  // Return the value of the authentication token
  return authCookie?.value;
}
