#!/usr/bin/env bun
import { App } from "@slack/bolt";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.event("app_mention", async ({ event, say }) => {
  await say(`Hello, <@${event.user}>!`);
});

// app.event("app_mention", async ({ event, say }) => {
//   if (event.channel !== "innovation-fest-sonar") {
//     return;
//   }

//   const messageParts = event.text.match(/search (.*@.+\..+) (.*)/i);
//   const email = messageParts?.[1];
//   const explanation = messageParts?.[2];

//   if (email !== undefined && explanation !== undefined) {
//     await say(`Searching for ${email}...`);

//     const patientSearch = new PatientSearch();
//     const results = await patientSearch.search(email);

//     if (results.length === 0) {
//       await say(`Couldn't find any patient with email address ${email}.`);
//     } else {
//       await say(
//         `Found ${
//           results.length
//         } patients with email address ${email}.: ${results.join(", ")}`
//       );
//     }
//   } else if (!email || !explanation) {
//     await say(
//       "Please provide an email address and an explanation. E.g. `search test@kaikuhealth.com because I don't know who this is`"
//     );
//   }
// });

(async () => {
  await app.start();
  console.log("⚡️ Slack bot is running!");
})();
