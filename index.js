// Required libraries and dependencies
const { google } = require('googleapis');
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");

// Defining necessary scopes for Gmail API access
const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.labels',
    'https://mail.google.com/',
  ];

  // Function to authorize and get authenticated client
async function authorize() {
    const client = await authenticate({
      scopes: SCOPES,
      keyfilePath: path.join(__dirname, "credentials.json"),
    });
    return client;
}
  


// Main function to start the application
async function main() {
  try {
    const auth = await authorize();
    console.log(auth);
  } catch (error) {
    console.error('Error starting the app:', error);
  }
}

// Starting the application
main();
  