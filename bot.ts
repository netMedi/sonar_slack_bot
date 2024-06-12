#!/usr/bin/env bun
import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.event('app_mention', async ({ event, say }) => {
  await say(`Hello, <@${event.user}>!`);
});

(async () => {
  await app.start();
  console.log('⚡️ Slack bot is running!');
})();