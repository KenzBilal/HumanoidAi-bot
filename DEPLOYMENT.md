# 🚀 Deployment Guide

This bot is designed to run in both **Polling** (local/VPS) and **Webhook** (Serverless/Cloud) modes.

---

## ☁️ Deploying to Render (Recommended)

Render is the best platform for hosting this bot due to its support for Web Services and health checks.

### 1. Simple Deployment (Blueprint)
1.  Push your code to GitHub.
2.  In Render Dashboard, click **New +** > **Blueprint**.
3.  Connect your repository. Render will automatically detect `render.yaml`.
4.  Fill in the required **Environment Variables**:
    - `TELEGRAM_BOT_TOKEN`: From @BotFather.
    - `ADMIN_ID`: Your Telegram ID.
    - `CHANNEL_ID`: The ID of your announcement channel.
    - `WEBHOOK_URL`: The URL Render gives you + `/webhook` (e.g., `https://my-bot.onrender.com/webhook`).
    - `AI_API_KEY`: Your Grok or DeepSeek key.

### 2. Manual Setup
If you prefer manual setup:
- **Service Type**: Web Service
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
    - `BOT_MODE`: `webhook`
    - `PORT`: `3000` (Render detects this automatically)
- **Health Check**: Set to `/health`.

---

## 🏢 Platform-Specific Notes

### Render Free Tier
- **Sleeping**: Render's free tier sleeps after 15 minutes of inactivity.
- **Keep-Alive**: The bot includes a built-in "Keep-Alive" service. It will automatically ping itself every 10 minutes **if `WEBHOOK_URL` is set**. This keeps the service awake 24/7.

### Vercel / Serverless
- Set `BOT_MODE=webhook`.
- Ensure `WEBHOOK_URL` matches your project's production URL.

---

## 🛠️ Local / VPS Deployment (Polling)

If you have a persistent server or are developing locally:

1.  **Configure `.env`**:
    ```env
    BOT_MODE=polling
    TELEGRAM_BOT_TOKEN=...
    ```
2.  **Run with PM2**:
    ```bash
    npm install -g pm2
    pm2 start src/index.js --name "humanoid-bot"
    ```

---

## 📈 Monitoring
- **Health Check**: Visit `https://your-app.com/health` to verify the bot is online.
- **Stats**: Use the `/admin` command in Telegram to see message processing statistics.
