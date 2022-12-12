import p from "puppeteer";
import puppeteer from "puppeteer-extra";

import UserAgent from "user-agents";

import { Subject } from "rxjs";

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

interface AuthOptions {
  user?: string;
  password?: string;
  sessionTokenKey?: string;
  clearanceTokenKey?: string;
  passiveMode?: boolean;
}
export async function getAuthToken(
  url: string,
  {
    user,
    password,
    sessionTokenKey = "__Secure-next-auth.session-token",
    clearanceTokenKey = "cf_clearance",
    passiveMode = false,
  }: AuthOptions
) {
  // Launch a new browser instance
  console.log("launch browser");
  const browser = await puppeteer.launch({
    headless: false,
    //args: ["--no-sandbox"],
    // ignoreHTTPSErrors: true,
    executablePath: p.executablePath(),
  });

  // Create a new page
  console.log("new page");
  const page = await browser.newPage();

  console.log("set viewport");
  await page.setViewport({
    width: 1920,
    height: 1280,
    deviceScaleFactor: 1,
  });

  console.log("set user agent");
  const puppeteerUserAgent = UserAgent.random().toString();
  await page.setUserAgent(puppeteerUserAgent);

  // wait 2 minutes at max
  console.log("set defaults");
  await page.setDefaultNavigationTimeout(1200000);
  await page.setDefaultTimeout(1200000);

  // Navigate to the website
  console.log("goto" + url);
  await page.goto(url);

  if (!passiveMode) {
    // FIXME it seems that we have to handle waiting for buttons differently if the captcha occurs the next time
    await page.waitForFunction(
      (selector) =>
        [...document.querySelectorAll(selector)].find(
          (el) => el.innerHTML.indexOf("Log in") > -1
        ),
      {},
      "button"
    );
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
  }

  if (passiveMode) {
    console.log(
      "passive mode enabled. you will have to login manually. When done the token is extracted atuomatically"
    );
  }

  const token$ = new Subject<{
    sessionToken: string;
    userAgent: string;
    clearanceToken: string;
  }>();

  let lastSessionToken: string | null = null;
  let lastClearanceToken: string | null = null;
  async function getToken() {
    // Get the list of HTTPS cookies
    const cookies = await page.cookies();
    console.log("test for new token");
    // Find the authentication token cookie
    const sessionTokenCookie = cookies.find(
      (cookie) => cookie.name === sessionTokenKey
    );
    const currentSessionToken = sessionTokenCookie?.value;

    const clearanceTokenCookie = cookies.find(
      (cookie) => cookie.name === clearanceTokenKey
    );
    const currentClearanceToken = clearanceTokenCookie?.value;

    if (currentSessionToken && currentClearanceToken) {
      if (
        lastSessionToken != currentSessionToken ||
        lastClearanceToken != currentClearanceToken
      ) {
        console.log("(session) token changed");

        token$.next({
          sessionToken: currentSessionToken,
          userAgent: puppeteerUserAgent,
          clearanceToken: currentClearanceToken,
        });
        // store copy of token locally
        lastSessionToken = currentSessionToken;
        lastClearanceToken = currentClearanceToken;
      }
    }
  }
  setInterval(getToken, 1000);

  return token$;
}
