# Quick Start Guide - Humanoid Telegram Bot

Get your Humanoid bot up and running in minutes!

## 5-Minute Setup

### Step 1: Create Your Bot Token

1. Open Telegram and search for **@BotFather**
2. Send `/start`
3. Send `/newbot`
4. Follow the prompts:
   - Bot name: `Humanoid` (or any name)
   - Bot username: `HumanoidCodeLab_bot` or `Hclab_bot`
5. Copy the token (looks like: `123456789:ABCdefGHIjklmnoPQRstuvWXYZ`)

### Step 2: Get Your Channel ID

1. Add your bot to your Telegram channel as admin
2. Send a message in the channel
3. Go to: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
4. Replace `<YOUR_TOKEN>` with your actual token
5. Look for `"chat":{"id":-1003877249677}` - that's your channel ID

### Step 3: Get Your Admin ID

1. Send any message to your bot
2. Go to: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
3. Look for `"from":{"id":123456789}` - that's your admin ID

### Step 4: Configure the Bot

1. Clone or download the bot files
2. Create `.env` file:
```
TELEGRAM_BOT_TOKEN=your_token_here
CHANNEL_ID=-1003877249677
ADMIN_ID=your_admin_id_here
```

### Step 5: Run Locally

```bash
npm install
npm start
```

The bot should now be running and responding to messages!

## Testing the Bot

### User Commands

1. **Start the bot**: `/start`
   - Should show welcome message with app info

2. **Get help**: `/help`
   - Shows available commands

3. **View FAQ**: `/faq`
   - Shows all frequently asked questions

4. **App info**: `/info`
   - Displays app features and links

### Natural Conversation

Try typing:
- "What is HumanoidCodeLab?"
- "How do I install it?"
- "Can I use AI?"
- "I need help"

The bot should respond intelligently!

### Admin Commands

1. Send `/admin` to open admin panel
2. Click buttons to:
   - Update app info
   - Update FAQ
   - Post announcements
   - View statistics
   - Check for new releases

## Deployment Options

### Option A: Vercel (Easiest)

```bash
npm install -g vercel
vercel
```

Follow prompts and add environment variables.

### Option B: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Add environment variables
4. Deploy!

### Option C: Heroku

```bash
heroku create humanoid-bot
heroku config:set TELEGRAM_BOT_TOKEN=your_token
git push heroku main
```

### Option D: Self-Hosted

```bash
pm2 start bot.js --name "humanoid-bot"
pm2 startup
pm2 save
```

## Update Knowledge Base

### Via Admin Panel

1. Send `/admin`
2. Click "📝 Update App Info"
3. Send JSON:
```json
{
  "name": "HumanoidCodeLab",
  "description": "...",
  "features": ["Feature 1", "Feature 2"]
}
```

### Direct File Edit

Edit `knowledge_base.json` directly and restart the bot.

## Troubleshooting

### Bot not responding?

1. Check `.env` file has correct token
2. Verify bot is added to channel
3. Check logs: `npm start`
4. Restart bot

### Admin commands not working?

1. Verify `ADMIN_ID` is correct
2. Make sure you're the admin
3. Try `/admin` command

### Releases not showing?

1. Add `GITHUB_TOKEN` to `.env`
2. Verify GitHub token has repo access
3. Try `/admin` → "Check Releases"

## Next Steps

1. ✅ Bot is running
2. 📝 Update knowledge base with your app details
3. 🚀 Deploy to production
4. 📊 Monitor bot activity
5. 🔄 Keep knowledge base updated

## Common Commands Reference

| Command | What it does |
|---------|-------------|
| `/start` | Welcome message |
| `/help` | Help menu |
| `/faq` | FAQ list |
| `/info` | App information |
| `/admin` | Admin panel |

## File Structure

```
humanoid-telegram-bot/
├── bot.js                 # Main bot file (polling)
├── bot-webhook.js         # Webhook version (production)
├── config-manager.js      # Configuration management
├── knowledge_base.json    # Bot knowledge base
├── .env                   # Environment variables
├── package.json           # Dependencies
├── README.md              # Full documentation
├── DEPLOYMENT.md          # Deployment guide
└── QUICKSTART.md          # This file
```

## Support

Need help?

- 📧 Email: humanoidcodelab@gmail.com
- 🔗 GitHub: https://github.com/KenzBilal/HumanoidCodeLab
- 💬 Telegram: t.me/HumanoidCodeLab

---

**You're all set! 🎉 Your Humanoid bot is ready to serve your community.**
