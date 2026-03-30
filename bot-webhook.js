const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const { Octokit } = require('octokit');
const fs = require('fs');
const path = require('path');
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const channelId = process.env.CHANNEL_ID;
const adminId = process.env.ADMIN_ID;
const webhookUrl = process.env.WEBHOOK_URL;
const port = process.env.PORT || 3000;

// Knowledge base storage
const KB_FILE = path.join(__dirname, 'knowledge_base.json');

// Initialize knowledge base
function initKnowledgeBase() {
  const defaultKB = {
    app_info: {
      name: 'Humanoid Code Lab',
      description: 'A professional, cross-platform Electron application for 3D humanoid robot programming.',
      features: [
        'Real-time 3D Humanoid with 18 controllable joints',
        'Custom Scripting DSL with Python-like syntax',
        'Monaco Editor Integration with IntelliSense',
        'Visual Stepping Debugger',
        'Interactive Training Curriculum',
        'Multi-Provider AI (GPT-4o, Claude 3.7, Gemini 2.0)',
        'Secure Keychains via OS keychain',
        'Visual Animation Editor',
        'Dynamic Layout with draggable panes'
      ],
      platforms: ['Windows', 'macOS', 'Linux'],
      github: 'https://github.com/KenzBilal/HumanoidCodeLab',
      email: 'humanoidcodelab@gmail.com',
      instagram: '@hclab.ai',
      telegram: 't.me/HumanoidCodeLab'
    },
    faq: [
      {
        q: 'What is HumanoidCodeLab?',
        a: 'HumanoidCodeLab is a professional 3D humanoid robot programming platform where you can write Python-like scripts to control a fully articulated 3D robot model in real-time.'
      },
      {
        q: 'What are the system requirements?',
        a: 'HumanoidCodeLab runs on Windows, macOS, and Linux. Requires a modern processor and GPU for smooth 3D rendering.'
      },
      {
        q: 'Is it free?',
        a: 'Yes, HumanoidCodeLab is free and open-source. You can download it from our GitHub repository.'
      },
      {
        q: 'How do I get started?',
        a: 'Visit our GitHub repository at https://github.com/KenzBilal/HumanoidCodeLab to download the latest release and follow the installation instructions.'
      },
      {
        q: 'Can I use AI to generate scripts?',
        a: 'Yes! HumanoidCodeLab supports multiple AI providers: OpenAI GPT-4o, Anthropic Claude 3.7, and Google Gemini 2.0 Flash.'
      },
      {
        q: 'How do I report bugs or request features?',
        a: 'Please visit our GitHub repository and open an issue. You can also contact us at humanoidcodelab@gmail.com.'
      }
    ],
    support_topics: {
      installation: 'Download from GitHub and follow platform-specific installation guides.',
      scripting: 'Use Python-like syntax to control the robot. Example: robot.walk.forward(steps=3)',
      debugging: 'Use the Visual Stepping Debugger to execute scripts line-by-line and debug issues.',
      ai_generation: 'Enable AI providers in settings and use natural language to generate scripts.'
    },
    last_updated: new Date().toISOString(),
    stats: {
      messages_processed: 0,
      users_helped: 0,
      releases_announced: 0
    }
  };

  if (!fs.existsSync(KB_FILE)) {
    fs.writeFileSync(KB_FILE, JSON.stringify(defaultKB, null, 2));
    console.log('✅ Knowledge base initialized');
  }
  return defaultKB;
}

// Load knowledge base
function loadKnowledgeBase() {
  try {
    return JSON.parse(fs.readFileSync(KB_FILE, 'utf8'));
  } catch (error) {
    console.error('Error loading KB:', error);
    return initKnowledgeBase();
  }
}

// Save knowledge base
function saveKnowledgeBase(kb) {
  fs.writeFileSync(KB_FILE, JSON.stringify(kb, null, 2));
  console.log('✅ Knowledge base saved');
}

// Update stats
function updateStats(type) {
  const kb = loadKnowledgeBase();
  if (type === 'message') kb.stats.messages_processed++;
  if (type === 'user') kb.stats.users_helped++;
  if (type === 'release') kb.stats.releases_announced++;
  saveKnowledgeBase(kb);
}

// Format app info for display
function formatAppInfo(kb) {
  const info = kb.app_info;
  return `
🤖 <b>${info.name}</b>

${info.description}

<b>Key Features:</b>
${info.features.map(f => `• ${f}`).join('\n')}

<b>Platforms:</b> ${info.platforms.join(', ')}

<b>Links:</b>
🔗 GitHub: ${info.github}
📧 Email: ${info.email}
📸 Instagram: ${info.instagram}
💬 Telegram: ${info.telegram}
  `.trim();
}

// AI-powered response generator
async function generateAIResponse(userMessage, kb) {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('feature') || lowerMsg.includes('what can')) {
    return `🚀 <b>HumanoidCodeLab Features:</b>\n\n${kb.app_info.features.map(f => `✓ ${f}`).join('\n')}`;
  }
  
  if (lowerMsg.includes('download') || lowerMsg.includes('install') || lowerMsg.includes('get started')) {
    return `📥 <b>Get Started:</b>\n\nDownload HumanoidCodeLab from:\n${kb.app_info.github}\n\nSupported platforms: ${kb.app_info.platforms.join(', ')}`;
  }
  
  if (lowerMsg.includes('ai') || lowerMsg.includes('generate') || lowerMsg.includes('script')) {
    return `🤖 <b>AI Script Generation:</b>\n\nHumanoidCodeLab supports:\n• OpenAI GPT-4o\n• Anthropic Claude 3.7\n• Google Gemini 2.0 Flash\n\nUse natural language to generate complex robot scripts!`;
  }
  
  if (lowerMsg.includes('help') || lowerMsg.includes('support') || lowerMsg.includes('issue')) {
    return `💬 <b>Need Help?</b>\n\n📧 Email: ${kb.app_info.email}\n🔗 GitHub Issues: ${kb.app_info.github}/issues\n📸 Instagram: ${kb.app_info.instagram}`;
  }

  return `👋 Hi! I'm Humanoid, the HumanoidCodeLab assistant. I can help you with:\n\n• 📚 App features and capabilities\n• 📥 Installation and setup\n• 🤖 AI script generation\n• 💬 Support and troubleshooting\n• ❓ FAQs\n\nWhat would you like to know about HumanoidCodeLab?`;
}

// Check for new GitHub releases
async function checkNewReleases() {
  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    const releases = await octokit.rest.repos.listReleases({
      owner: 'KenzBilal',
      repo: 'HumanoidCodeLab',
      per_page: 1
    });

    if (releases.data.length > 0) {
      const latest = releases.data[0];
      const releaseMessage = `
🎉 <b>New Release Available!</b>

<b>${latest.name || latest.tag_name}</b>

${latest.body || 'Check GitHub for details'}

📥 <b>Download:</b>
${latest.assets.map(asset => `• <a href="${asset.browser_download_url}">${asset.name}</a>`).join('\n')}

🔗 <a href="${latest.html_url}">View on GitHub</a>
      `.trim();

      return releaseMessage;
    }
  } catch (error) {
    console.error('Error checking releases:', error);
  }
  return null;
}

// Admin panel with inline buttons
function getAdminPanel() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('📝 Update App Info', 'admin_update_info')],
    [Markup.button.callback('❓ Update FAQ', 'admin_update_faq')],
    [Markup.button.callback('📢 Post Announcement', 'admin_announce')],
    [Markup.button.callback('📊 View Stats', 'admin_stats')],
    [Markup.button.callback('🔄 Check Releases', 'admin_check_releases')],
    [Markup.button.callback('❌ Close', 'admin_close')]
  ]);
}

// Bot commands
bot.start(async (ctx) => {
  const kb = loadKnowledgeBase();
  updateStats('user');
  const welcomeMessage = `
👋 <b>Welcome to Humanoid!</b>

I'm the AI assistant for <b>HumanoidCodeLab</b>, a professional 3D humanoid robot programming platform.

${formatAppInfo(kb)}

<b>How I can help:</b>
• Answer questions about HumanoidCodeLab
• Help with installation and setup
• Explain features and capabilities
• Provide support and troubleshooting
• Share FAQs

Just type your question naturally, and I'll help! 🚀
  `.trim();

  await ctx.reply(welcomeMessage, { parse_mode: 'HTML' });
});

bot.command('admin', async (ctx) => {
  if (ctx.from.id.toString() !== adminId) {
    return ctx.reply('❌ You do not have admin permissions.');
  }

  await ctx.reply('🛠️ <b>Admin Panel</b>', {
    parse_mode: 'HTML',
    ...getAdminPanel()
  });
});

bot.command('help', async (ctx) => {
  const kb = loadKnowledgeBase();
  const helpMessage = `
<b>📚 Help & Support</b>

<b>Available Commands:</b>
/start - Welcome message
/help - This help menu
/faq - Frequently asked questions
/info - App information
/admin - Admin panel (admin only)

<b>Support Channels:</b>
📧 Email: ${kb.app_info.email}
🔗 GitHub: ${kb.app_info.github}
📸 Instagram: ${kb.app_info.instagram}

<b>Or just type your question naturally!</b> I'll do my best to help. 😊
  `.trim();

  await ctx.reply(helpMessage, { parse_mode: 'HTML' });
});

bot.command('faq', async (ctx) => {
  const kb = loadKnowledgeBase();
  const faqMessage = kb.faq.map((item, i) => 
    `<b>Q${i + 1}: ${item.q}</b>\nA: ${item.a}`
  ).join('\n\n');

  await ctx.reply(`<b>❓ Frequently Asked Questions</b>\n\n${faqMessage}`, { parse_mode: 'HTML' });
});

bot.command('info', async (ctx) => {
  const kb = loadKnowledgeBase();
  await ctx.reply(formatAppInfo(kb), { parse_mode: 'HTML' });
});

// Handle natural language messages
bot.on('message', async (ctx) => {
  if (ctx.message.text.startsWith('/')) return;

  updateStats('message');
  const userMessage = ctx.message.text;
  const response = await generateAIResponse(userMessage, loadKnowledgeBase());
  
  await ctx.reply(response, { parse_mode: 'HTML' });
});

// Admin callbacks
bot.action('admin_update_info', async (ctx) => {
  if (ctx.from.id.toString() !== adminId) {
    return ctx.answerCbQuery('❌ Permission denied');
  }

  await ctx.editMessageText('📝 <b>Update App Info</b>\n\nSend the new app information in JSON format:', {
    parse_mode: 'HTML'
  });
});

bot.action('admin_update_faq', async (ctx) => {
  if (ctx.from.id.toString() !== adminId) {
    return ctx.answerCbQuery('❌ Permission denied');
  }

  await ctx.editMessageText('❓ <b>Update FAQ</b>\n\nSend the new FAQ in JSON format:', {
    parse_mode: 'HTML'
  });
});

bot.action('admin_announce', async (ctx) => {
  if (ctx.from.id.toString() !== adminId) {
    return ctx.answerCbQuery('❌ Permission denied');
  }

  await ctx.editMessageText('📢 <b>Post Announcement</b>\n\nSend your announcement message:', {
    parse_mode: 'HTML'
  });
});

bot.action('admin_stats', async (ctx) => {
  if (ctx.from.id.toString() !== adminId) {
    return ctx.answerCbQuery('❌ Permission denied');
  }

  const kb = loadKnowledgeBase();
  const statsMessage = `
📊 <b>Bot Statistics</b>

<b>Messages Processed:</b> ${kb.stats.messages_processed}
<b>Users Helped:</b> ${kb.stats.users_helped}
<b>Releases Announced:</b> ${kb.stats.releases_announced}

<b>Knowledge Base:</b>
• App Info: Updated ${new Date(kb.last_updated).toLocaleDateString()}
• FAQ Items: ${kb.faq.length}
• Support Topics: ${Object.keys(kb.support_topics).length}

<b>Status:</b> ✅ Active and running
  `.trim();

  await ctx.editMessageText(statsMessage, {
    parse_mode: 'HTML',
    ...getAdminPanel()
  });
});

bot.action('admin_check_releases', async (ctx) => {
  if (ctx.from.id.toString() !== adminId) {
    return ctx.answerCbQuery('❌ Permission denied');
  }

  await ctx.answerCbQuery('🔄 Checking for new releases...');
  const releaseMessage = await checkNewReleases();

  if (releaseMessage) {
    updateStats('release');
    await ctx.reply(releaseMessage, { parse_mode: 'HTML' });
  } else {
    await ctx.reply('✅ No new releases found. You are on the latest version!');
  }
});

bot.action('admin_close', async (ctx) => {
  await ctx.deleteMessage();
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('❌ An error occurred. Please try again later.');
});

// Express routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

app.get('/stats', (req, res) => {
  const kb = loadKnowledgeBase();
  res.json(kb.stats);
});

// Set webhook
async function setWebhook() {
  try {
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`✅ Webhook set to: ${webhookUrl}`);
  } catch (error) {
    console.error('Error setting webhook:', error);
  }
}

// Start server
app.listen(port, async () => {
  console.log(`🤖 Humanoid bot webhook server running on port ${port}`);
  if (webhookUrl) {
    await setWebhook();
  }
});

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('Shutting down...');
  process.exit(0);
});

process.once('SIGTERM', () => {
  console.log('Shutting down...');
  process.exit(0);
});
