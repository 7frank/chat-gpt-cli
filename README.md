# overview

TLDR; CLI using functionality of https://chat.openai.com

Uses https://www.npmjs.com/package/chatgpt and adds login functionality.

# how to

- install `npm i`
- login
  - `mv .example.env .env`
  - add your credentials to the fields "OPENAI_USERNAME" and "OPENAI_PASSWORD" if you don't want to be prompted for them each time you login
  - `npm run login`

# requirements

nodejs > v16.8.0

- do you have the correct version?

  - `node -v`

- wrong node version?
  - [install nvm](https://github.com/nvm-sh/nvm/blob/master/README.md)
  - afterwards installl proper node version
    - `nvm install 16.8`
    - `nvm use 16.8`
