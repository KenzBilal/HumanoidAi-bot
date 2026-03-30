const axios = require('axios');

/**
 * Pings the bot's own public URL to prevent it from sleeping on Render's free tier.
 */
function startKeepAlive() {
  const url = process.env.WEBHOOK_URL || process.env.SELF_PING_URL;
  
  if (!url) {
    console.warn('⚠️ No WEBHOOK_URL or SELF_PING_URL provided. Keep-Alive skipped.');
    return;
  }

  const healthUrl = url.endsWith('/') ? `${url}health` : `${url}/health`;
  const interval = 10 * 60 * 1000; // 10 minutes

  console.log(`📡 Keep-Alive: Monitoring ${healthUrl} every 10 minutes.`);

  setInterval(async () => {
    try {
      const startTime = Date.now();
      const response = await axios.get(healthUrl);
      const latency = Date.now() - startTime;
      
      if (response.status === 200) {
        console.log(`✅ Keep-Alive: Pinged successfully at ${new Date().toLocaleTimeString()} (Latency: ${latency}ms)`);
      }
    } catch (error) {
      console.error(`❌ Keep-Alive: Ping failed. Error: ${error.message}`);
    }
  }, interval);
}

module.exports = { startKeepAlive };
