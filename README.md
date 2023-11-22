# Auto-Reply-Bot

This Node.js-based application automates replying to incoming emails in your Gmail inbox while you're on vacation. It identifies unreplied messages, sends automated replies, and manages the labeling of replied emails.

## Features

- Automatically identifies unread messages in the inbox without replies.
- Sends personalized auto-replies to incoming messages.
- Labels and archives replied messages to keep your inbox organized.

## Prerequisites

- Node.js installed on your system.
- Google Cloud Project set up with Gmail API enabled.(List of dependencies are mentioned below)
- `credentials.json` obtained from the Google Developer Console.

## Setup

1. Clone the repository:

   git clone https://github.com/your-username/auto-reply-vacation-bot.git

2. Install dependencies:

   cd auto-reply-bot
   npm install

3. Obtain the `credentials.json` file and place it in the root directory.

4. Run the application:

   node index.js

## Configuration

- Modify the content of auto-replies in the `sendAutoReply` function in `index.js` according to your preference.
- Adjust the interval for checking emails in `runSequence` by changing the random interval (in milliseconds).

## Usage

- The application runs in the background and automatically handles incoming emails based on the defined logic.

## Notes

- This project uses the Gmail API to manage emails. Ensure proper authorization and API access before using.

## Acknowledgments

- This project was created using Google's Node.js Client Library for Gmail API.


## Dependencies Required :


To run this Node.js app successfully, you'll need to install the necessary dependencies. Here are the dependencies based on the code we've been working with:

1) googleapis: This library provides easy access to Google APIs. It includes the Gmail API, which your app interacts with.

    npm install googleapis

2) google-auth-library: This library helps with authentication to Google services.

    npm install google-auth-library

3) express: If you're using Express for your web server.

    npm install express

4) @google-cloud/local-auth: This library provides a local authentication flow for Google services.

    npm install @google-cloud/local-auth

5) fs.promises: This is part of the Node.js standard library, so you don't need to install it separately.

6) Make sure to have node-fetch installed too, as it is a dependency for @google-cloud/local-auth. If it's not installed automatically, you can install it using:

    npm install node-fetch

To install all dependencies, navigate to your project's root directory in the terminal and run:

    npm install

This command will read your package.json file and install all the dependencies listed there.

To start with the project, you need to get credentials.json into your root directory. to get this file, You need to create a google could project. To learn how to do that refer:

    https://developers.google.com/workspace/guides/create-project

Also create a client Id and add user's mail in your project so as to get through Google Auth
