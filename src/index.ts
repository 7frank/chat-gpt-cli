const open = require("open");
const readline = require("readline");
const url = require("url");
const querystring = require("querystring");

// Create a readline interface to read input from the user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// This function prompts the user to open a web browser and go to the specified URL
function promptLogin() {
  // If the user is not logged in, prompt them to open a web browser and go to the specified URL
  const loginUrl = "https://example.com/login";
  console.log(`Please open a web browser and go to ${loginUrl} to log in.`);

  // Open the login URL in the default web browser
  open(loginUrl);
}

// This function processes the redirect URL and completes the login process
function processRedirectUrl(redirectUrlStr) {
  const redirectUrl = url.parse(redirectUrlStr);

  // Parse the one-time token or code from the URL query string
  const urlParams = querystring.parse(redirectUrl.query);
  const token = urlParams.get("token");

  if (!token) {
    console.error("Error: No token found in URL query string.");
    return;
  }

  // Use the token to complete the login process
  console.log(`Your login token is: ${token}`);
}

// Check if the user is already logged in
if (isLoggedIn()) {
  console.log("You are already logged in.");
} else {
  // If the user is not logged in, prompt them to open a web browser and go to the login URL
  promptLogin();

  // Once the user has logged in and been redirected to the specified redirect URL,
  // they should enter the full URL into the CLI
  rl.question("Enter the full redirect URL: ", (redirectUrlStr) => {
    processRedirectUrl(redirectUrlStr);
  });
}

// This function should check whether the user is already logged in
function isLoggedIn() {
  return false;
}
