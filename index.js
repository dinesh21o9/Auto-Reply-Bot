// Required libraries and dependencies
const { google } = require("googleapis");
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");

// Defining necessary scopes for Gmail API access
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com/",
];

const intervals = [
  { start: 45000, end: 120000 }, // Interval in milliseconds (45 to 120 seconds)
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

// Function to create a label for auto-replied messages or retrieve if it exists
async function createLabel(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  const labelName = "Auto-Replied by BOT";

  try {
    // Try creating a new label
    const response = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: labelName,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    return response.data.id;
  } catch (error) {
    // If label already exists, retrieve its ID
    if (error.code === 409) {
      const response = await gmail.users.labels.list({
        userId: "me",
      });
      const label = response.data.labels.find(
        (label) => label.name === labelName
      );
      return label.id;
    } else {
      throw error;
    }
  }
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
      const labelId = await createLabel(auth);
      const messages = await getUnrepliedMessages(auth);

      if (messages && messages.length > 0) {
        console.log(messages.length); //Checking nnumber of unread messages
        console.log(labelId);//Checking if label Id is generated or not
      }
    } catch (error) {
      console.error("Error in sequence:", error);
    }
  }, getRandomInterval(intervals)); // Random interval between 45 to 120 seconds
}

// Main function to start the application
async function main() {
  try {
    const auth = await authorize();
    runSequence(auth);
  } catch (error) {
    console.error("Error starting the app:", error);
  }
}

// Starting the application
main();
