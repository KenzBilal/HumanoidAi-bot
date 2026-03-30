# Humanoid Telegram Bot

A production-ready AI-powered Telegram bot for the HumanoidCodeLab community. Features natural conversation, automatic GitHub release announcements, admin management panel, and intelligent support routing.

## Features

- **🤖 AI-Powered Conversations**: Users can type naturally and get intelligent responses about HumanoidCodeLab
- **📢 Automatic Release Announcements**: Monitors GitHub for new releases and posts them to the channel
- **🛠️ Admin Management Panel**: Easy-to-use inline buttons for managing knowledge base and announcements
- **❓ Smart FAQ System**: Dynamically updatable FAQ with admin controls
- **💬 Support & Help**: Built-in support topics and troubleshooting guidance
- **🔐 Secure Admin Access**: Admin commands protected by user ID verification
- **📊 Statistics & Monitoring**: View bot stats and check for new releases on demand

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Telegram Bot Token (from @BotFather)
- Telegram Channel ID
- (Optional) GitHub Token for release monitoring

### Installation

1. **Clone or download the bot**:
```bash
cd humanoid-telegram-bot
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and add:
- `TELEGRAM_BOT_TOKEN`: Your bot token from @BotFather
- `CHANNEL_ID`: Your Telegram channel ID
- `ADMIN_ID`: Your Telegram user ID (for admin commands)
- `GITHUB_TOKEN`: (Optional) GitHub personal access token

4. **Start the bot**:
```bash
npm start
```

The bot will initialize with a default knowledge base and start listening for messages.

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | ✅ Yes |
| `CHANNEL_ID` | Telegram channel ID (negative number) | ✅ Yes |
| `ADMIN_ID` | Your Telegram user ID for admin access | ✅ Yes |
| `GITHUB_TOKEN` | GitHub token for release monitoring | ❌ Optional |
| `PORT` | Server port for webhook (default: 3000) | ❌ Optional |
| `NODE_ENV` | Environment (development/production) | ❌ Optional |

### Knowledge Base

The bot stores knowledge in `knowledge_base.json` with:

- **app_info**: Basic app information, features, platforms, and contact links
- **faq**: Frequently asked questions and answers
- **support_topics**: Common support categories and solutions
- **last_updated**: Timestamp of last update

Update via admin panel or directly edit the JSON file.

## Usage

### User Commands

- `/start` - Welcome message with app overview
- `/help` - Help menu and support channels
- `/faq` - View all frequently asked questions
- `/info` - Display app information and features

### Natural Conversation

Users can simply type questions naturally:
- "What features does HumanoidCodeLab have?"
- "How do I install it?"
- "Can I use AI to generate scripts?"
- "Where can I get help?"

The bot intelligently routes responses based on keywords and context.

### Admin Commands

- `/admin` - Open admin management panel

**Admin Panel Options**:
- 📝 **Update App Info** - Send JSON to update app information
- ❓ **Update FAQ** - Send JSON to update FAQ items
- 📢 **Post Announcement** - Post custom announcements to the channel
- 📊 **View Stats** - See bot statistics and knowledge base info
- 🔄 **Check Releases** - Manually check for new GitHub releases
- ❌ **Close** - Close the admin panel

## Deployment

### Local Development

```bash
npm run dev
```

Uses `nodemon` for auto-restart on file changes.

### Production Deployment

#### Option 1: Vercel

1. Create a `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "bot.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "bot.js"
    }
  ]
}
```

2. Deploy:
```bash
vercel deploy
```

#### Option 2: Railway

1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Set start command: `npm start`
4. Deploy

#### Option 3: Heroku

1. Create `Procfile`:
```
web: npm start
```

2. Deploy:
```bash
heroku create humanoid-bot
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set CHANNEL_ID=your_channel_id
heroku config:set ADMIN_ID=your_admin_id
git push heroku main
```

#### Option 4: Self-Hosted (VPS/Server)

1. SSH into your server
2. Clone repository and install dependencies
3. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start bot.js --name "humanoid-bot"
pm2 startup
pm2 save
```

## Admin Panel Usage

### Update App Info

Send JSON in this format:
```json
{
  "name": "HumanoidCodeLab",
  "description": "...",
  "features": ["Feature 1", "Feature 2"],
  "platforms": ["Windows", "macOS", "Linux"],
  "github": "https://github.com/...",
  "email": "...",
  "instagram": "@...",
  "telegram": "t.me/..."
}
```

### Update FAQ

Send JSON in this format:
```json
[
  {
    "q": "Question?",
    "a": "Answer"
  }
]
```

### Post Announcement

Simply type your announcement message. It will be posted to the channel with formatting.

## GitHub Release Monitoring

The bot automatically monitors the HumanoidCodeLab GitHub repository for new releases. When a new release is detected:

1. Bot fetches release details
2. Formats announcement with download links
3. Posts to the Telegram channel

**Requirements**:
- `GITHUB_TOKEN` environment variable set
- Repository: `KenzBilal/HumanoidCodeLab`

## Architecture

```
bot.js
├── Knowledge Base Management
│   ├── Load/Save KB from JSON
│   ├── Initialize defaults
│   └── Admin update handlers
├── Message Handling
│   ├── Command processing
│   ├── Natural language routing
│   └── AI response generation
├── GitHub Integration
│   ├── Release monitoring
│   └── Announcement formatting
└── Admin Panel
    ├── Inline button callbacks
    ├── Permission verification
    └── Data update handlers
```

## Response Generation

The bot uses intelligent keyword matching to route user queries:

- **Features**: Questions about capabilities
- **Installation**: Setup and download queries
- **AI**: Script generation and AI providers
- **Support**: Help and troubleshooting
- **Default**: General assistance

For production, integrate with OpenAI GPT-4o, Claude, or Gemini for more sophisticated responses.

## Error Handling

- All errors are caught and logged
- Users receive friendly error messages
- Admin panel validates permissions
- Knowledge base has fallback defaults

## Future Enhancements

- [ ] Integration with OpenAI/Claude/Gemini for advanced AI responses
- [ ] User feedback and rating system
- [ ] Analytics and usage tracking
- [ ] Multi-language support
- [ ] Webhook integration for GitHub events
- [ ] User preference storage
- [ ] Advanced admin dashboard
- [ ] Rate limiting and spam protection

## Support

For issues or questions:
- 📧 Email: humanoidcodelab@gmail.com
- 🔗 GitHub: https://github.com/KenzBilal/HumanoidCodeLab
- 📸 Instagram: @hclab.ai
- 💬 Telegram: t.me/HumanoidCodeLab

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

**Made with ❤️ for the HumanoidCodeLab community**
