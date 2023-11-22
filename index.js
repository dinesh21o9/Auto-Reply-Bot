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

const intervals = [
    { start: 45000, end: 120000 }, // Interval in milliseconds (45 to 120 seconds)
    // { start: 60000, end: 180000 }, // Interval in milliseconds (60 to 180 seconds)
];

// Functino to get random Intervals from given start and end time
function getRandomInterval(intervals) {
    const { start, end } = intervals[0];
    return Math.floor(Math.random() * (end - start + 1) + start);
}

// Function to authorize and get authenticated client
async function authorize() {
    const client = await authenticate({
      scopes: SCOPES,
      keyfilePath: path.join(__dirname, "credentials.json"),
    });
    return client;
}

// Function to retrieve unreplied messages from the inbox
async function getUnrepliedMessages(auth) {
    const gmail = google.gmail({ version: "v1", auth });
    // Retrieve unread messages from the inbox
    const response = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["INBOX"],
      q: "is:unread",
    });
    return response.data.messages || [];
}

// Function to run the sequence periodically
function runSequence(auth) {
    setInterval(async () => {
      try {
        const messages = await getUnrepliedMessages(auth);
  
        if (messages && messages.length > 0) {
            console.log(messages.length);//Checking nnumber of unread messages
        }
      } catch (error) {
        console.error('Error in sequence:', error);
      }
    }, getRandomInterval(intervals)); // Random interval between 45 to 120 seconds
  }

// Main function to start the application
async function main() {
  try {
    const auth = await authorize();
    runSequence(auth);
  } catch (error) {
    console.error('Error starting the app:', error);
  }
}

// Starting the application
main();
  