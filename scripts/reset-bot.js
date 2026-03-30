const { Telegraf } = require('telegraf');
require('dotenv').config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  console.error('❌ Error: TELEGRAM_BOT_TOKEN not found in .env');
  process.exit(1);
}

const bot = new Telegraf(botToken);

async function resetBot() {
  console.log('🔄 Attempting to reset bot connection state...');
  
  try {
    // 1. Delete webhook and drop all pending updates
    // This stops any active "getUpdates" or "webhook" sessions on Telegram's side.
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    console.log('✅ Webhook deleted and pending updates dropped.');
    
    // 2. Small delay to let Telegram process the change
    console.log('⏳ Waiting 5 seconds for Telegram to propagate changes...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n✨ BOT RESET COMPLETE!');
    console.log('You can now:');
    console.log('1. Restart your Render service.');
    console.log('2. Or run "npm run dev" locally.');
    
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
  } finally {
    process.exit(0);
  }
}

resetBot();
