const { Telegraf, session } = require('telegraf');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('telegraf-ratelimit');
require('dotenv').config();

const { registerHandlers } = require('./core/bot-logic');
const { startKeepAlive } = require('./utils/keep-alive');

// 1. Initialize Bot
const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN must be provided!');

const bot = new Telegraf(botToken);

// 2. Middleware
bot.use(session()); // Critical for admin flows

// Rate limiting (max 1 message per second from each user)
const limitConfig = {
  window: 1000,
  limit: 1,
  onLimitExceeded: (ctx, next) => {
    // Silent on rate limit
  }
};
bot.use(rateLimit(limitConfig));

// 3. Register Handlers
registerHandlers(bot);

// 4. Server & Bot Launch Mode
const mode = (process.env.BOT_MODE || (process.env.RENDER ? 'webhook' : 'polling')).toLowerCase();
const port = process.env.PORT || 3000;

console.log(`🚀 Starting bot in ${mode.toUpperCase()} mode...`);
if (process.env.RENDER) console.log('☁️ Render environment detected.');

const app = express();
app.use(helmet()); // Production security
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', mode, timestamp: new Date().toISOString() });
});

if (mode === 'webhook') {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) throw new Error('WEBHOOK_URL must be provided for webhook mode!');

  // Webhook endpoint
  app.post('/webhook', (req, res) => {
    bot.handleUpdate(req.body, res);
  });

  app.listen(port, async () => {
    console.log(`🤖 Bot running in WEBHOOK mode on port ${port}`);
    try {
      await bot.telegram.setWebhook(webhookUrl);
      console.log(`✅ Webhook set to: ${webhookUrl}`);
      // Start keep-alive if on Render (auto-detected via WEBHOOK_URL)
      startKeepAlive();
    } catch (err) {
      console.error('❌ Failed to set webhook:', err.message);
    }
  });
} else {
  // Polling Mode
  app.listen(port, () => {
    console.log(`ℹ️ Health server running on port ${port}`);
  });

  bot.launch()
    .then(() => console.log('🤖 Bot running in POLLING mode'))
    .catch(err => console.error('❌ Launch failed:', err.message));
}

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('🛑 Stopping bot (SIGINT)...');
  if (mode === 'polling') bot.stop('SIGINT');
  process.exit(0);
});

process.once('SIGTERM', () => {
  console.log('🛑 Stopping bot (SIGTERM)...');
  if (mode === 'polling') bot.stop('SIGTERM');
  process.exit(0);
});
