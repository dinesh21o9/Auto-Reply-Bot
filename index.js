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

// Function to send an auto-reply to an unreplied message
async function sendAutoReply(auth, message, labelId) {
  try {
    const gmail = google.gmail({ version: 'v1', auth });

    // Retrieve message data for the unreplied message
    const messageData = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
    });

    const email = messageData.data;

    // Check if the email has already been replied to
    const hasReplied = email.payload.headers.some(
      (header) => header.name === 'In-Reply-To'
    );

    // If not replied, send an auto-reply
    if (!hasReplied) {
      const replyMessage = {
        userId: 'me',
        resource: {
          raw: Buffer.from(
            `To: ${email.payload.headers.find((header) => header.name === 'From')
              .value}\r\n` +
              `Subject: Re: ${email.payload.headers.find(
                (header) => header.name === 'Subject'
              ).value}\r\n` +
              `Content-Type: text/plain; charset="UTF-8"\r\n` +
              `Content-Transfer-Encoding: 7bit\r\n\r\n` +
              `Thank you for your email. I'm currently on vacation, I will reply as early as possible. This is a bot generated Mail.\r\n`
          ).toString('base64'),
        },
      };

      // Send the auto-reply message
      await gmail.users.messages.send(replyMessage);

      // Add label and move the email out of INBOX after replying
      await gmail.users.messages.modify({
        userId: 'me',
        id: message.id,
        resource: {
          addLabelIds: [labelId],
          removeLabelIds: ['INBOX'], // Remove from INBOX after replying
        },
      });

      console.log('Auto-reply sent and message labeled successfully.');
    } else {
      console.log('Email already replied.');
    }
  } catch (error) {
    console.error('Error sending auto-reply:', error);
    throw error;
  }
}

// Function to run the sequence periodically
function runSequence(auth) {
  setInterval(async () => {
    try {
      const labelId = await createLabel(auth);
      const messages = await getUnrepliedMessages(auth);

      if (messages && messages.length > 0) {
        for (const message of messages) {
          await sendAutoReply(auth, message, labelId);
        }
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
