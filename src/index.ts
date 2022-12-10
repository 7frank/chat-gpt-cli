import * as open from "open";
import * as readline from "readline";
import * as url from "url";
import * as querystring from "querystring";
import * as cy from "cypress";

// Set the base URL for the login page
const baseUrl = "http://localhost:3000/";

// Generate a random string to use as the state parameter
const state = Math.random().toString(36).substring(2);

// Generate the login URL with the state parameter
const loginUrl =
  url.resolve(baseUrl, "/login") + "?" + querystring.stringify({ state });

// Use Cypress to open the login page in a new browser window
cy.visit(loginUrl, {
  onBeforeLoad(win) {
    // Use the `open` module to open the login page in a new browser window
    open(loginUrl, { app: ["google chrome", "--incognito"] });
  },
});

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt the user to enter the code from the login page
rl.question("Enter the code from the login page: ", (code) => {
  // Close the readline interface
  rl.close();

  // Use Cypress to fill in the code on the login page and submit the form
  cy.get("#code").type(code);
  cy.get("#submit").click();
});
