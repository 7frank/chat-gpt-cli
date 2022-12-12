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
  authTokenKey?: string;
  passiveMode?: boolean;
}
export async function getAuthToken(
  url: string,
  {
    user,
    password,
    authTokenKey = "__Secure-next-auth.session-token",
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
  await page.setUserAgent(UserAgent.random().toString());

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

  const token$ = new Subject<string>();

  let lastToken: string | null = null;
  async function getToken() {
    // Get the list of HTTPS cookies
    const cookies = await page.cookies();
    console.log("test for new token");
    // Find the authentication token cookie
    const authCookie = cookies.find((cookie) => cookie.name === authTokenKey);
    const currToken = authCookie?.value;

    if (currToken && lastToken != currToken) {
      console.log("token changed");
      token$.next(currToken);
      lastToken = currToken;
    }
  }
  setInterval(getToken, 1000);

  return token$;
}
