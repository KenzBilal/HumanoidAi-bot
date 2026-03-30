# 🤖 Humanoid Telegram Bot (Production Ready)

A professional, modular, and AI-powered Telegram bot for the **HumanoidCodeLab** community. Built for scale, security, and natural interaction.

## 🌟 Enhanced Features

- **🧠 Google Gemini 2.0 Integration**: Context-aware conversations based on a manageable Knowledge Base.
- **🔌 Unified Entry Point**: Single codebase for both Polling (development) and Webhook (production) modes.
- **🛡️ Production Hardened**: Includes rate limiting, input validation (Zod), and security headers (Helmet).
- **🗄️ Database Ready**: Abstracted data layer with current JSON support and ready-to-flip Supabase integration.
- **🛠️ Professional Admin Suite**: Interactive inline menus for KB management, stats, and GitHub monitoring.

---

## 📂 Modular Architecture

```text
src/
├── core/
│   └── bot-logic.js    # Commands, actions, and message handling logic
├── services/
│   ├── ai.js           # Gemini 2.0 Flash integration & keyword fallback
│   ├── database.js     # Data abstraction layer (JSON / Supabase Mode)
│   └── github.js       # (Future) Release monitoring service
├── utils/
│   └── formatters.js   # UI formatting helpers
└── index.js            # Unified application entry point
```

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- Node.js 18+
- Telegram Bot Token ([@BotFather](https://t.me/BotFather))
- Google AI Studio API Key (for Gemini)

### 2. Configuration
Copy the template and fill in your details:
```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `BOT_MODE` | `polling` (Local) or `webhook` (Prod) | `polling` |
| `GEMINI_API_KEY` | API Key from Google AI Studio | - |
| `DB_MODE` | `json` or `supabase` | `json` |

### 3. Run the Bot
```bash
# Install dependencies
npm install

# Start in Development Mode
npm run dev

# Start in Production Mode
npm start
```

---

## 📝 Admin Panel Usage

Access the admin panel via `/admin` (User ID must match `ADMIN_ID` in `.env`).

- **Update App Info**: Send a valid JSON object.
- **Update FAQ**: Send a valid JSON array.
- **Check Releases**: Real-time GitHub release monitoring.
- **Stats**: View bot usage and message counts.

---

## 🚀 Deployment

- **Vercel/Railway/Heroku**: Set `BOT_MODE=webhook` and provide `WEBHOOK_URL`.
- **VPS/PM2**: Set `BOT_MODE=polling` for simplified setup or use webhooks with a reverse proxy.

---

## 🤝 Support & Contribution
- 📧 humanoidcodelab@gmail.com
- 🔗 [GitHub Repository](https://github.com/KenzBilal/HumanoidCodeLab)

**Made with ❤️ for the HumanoidCodeLab community**
