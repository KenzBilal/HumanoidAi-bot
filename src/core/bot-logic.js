const { Markup } = require('telegraf');
const { Octokit } = require('octokit');
const { z } = require('zod');
const db = require('../services/database');
const ai = require('../services/ai');

const adminId = process.env.ADMIN_ID;

// Validation schemas
const AppInfoSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  features: z.array(z.string()),
  platforms: z.array(z.string()),
  github: z.string().url(),
  email: z.string().email(),
  instagram: z.string().optional(),
  telegram: z.string().optional()
});

const FAQSchema = z.array(z.object({
  q: z.string().min(1),
  a: z.string().min(1)
}));

/**
 * Register all bot handlers
 */
function registerHandlers(bot) {
  // --- Admin Panel Creation ---
  const getAdminPanel = () => Markup.inlineKeyboard([
    [Markup.button.callback('📝 Update App Info', 'admin_update_info')],
    [Markup.button.callback('❓ Update FAQ', 'admin_update_faq')],
    [Markup.button.callback('📢 Post Announcement', 'admin_announce')],
    [Markup.button.callback('🧠 Update Memory', 'admin_update_memory')],
    [Markup.button.callback('📊 View Stats', 'admin_stats')],
    [Markup.button.callback('🔄 Check Releases', 'admin_check_releases')],
    [Markup.button.callback('❌ Close', 'admin_close')]
  ]);

  // --- Common Commands ---
  bot.start(async (ctx) => {
    const info = await db.getAppInfo();
    await db.updateStats('user');
    
    const welcomeMessage = `
👋 <b>Welcome to Humanoid!</b>

I'm the AI assistant for <b>HumanoidCodeLab</b>.

🤖 <b>${info.name}</b>
${info.description}

<b>Links:</b>
🔗 <a href="${info.github}">GitHub</a> | 💬 <a href="https://t.me/${info.telegram.replace('t.me/', '')}">Channel</a>

Type your question or use /help to see more. 🚀
`.trim();

    await ctx.reply(welcomeMessage, { parse_mode: 'HTML', disable_web_page_preview: true });
  });

  bot.command('help', async (ctx) => {
    const info = await db.getAppInfo();
    const helpMessage = `
<b>📚 Help & Support</b>

<b>Commands:</b>
/start - Welcome menu
/faq - Common questions
/info - App details
/help - This menu

<b>Support:</b>
📧 ${info.email}
🔗 <a href="${info.github}">GitHub Issues</a>

<b>Just type naturally!</b> I'll use Gemini 2.0 to help you. 😊
`.trim();
    await ctx.reply(helpMessage, { parse_mode: 'HTML' });
  });

  bot.command('faq', async (ctx) => {
    const faq = await db.getFAQ();
    const faqMessage = faq.map((item, i) => `<b>${i + 1}. ${item.q}</b>\n${item.a}`).join('\n\n');
    await ctx.reply(`<b>❓ FAQ</b>\n\n${faqMessage}`, { parse_mode: 'HTML' });
  });

  bot.command('info', async (ctx) => {
    const info = await db.getAppInfo();
    const infoMessage = `
🤖 <b>${info.name}</b>
${info.description}

<b>Features:</b>
${info.features.map(f => `✓ ${f}`).join('\n')}

<b>Platforms:</b> ${info.platforms.join(', ')}
`.trim();
    await ctx.reply(infoMessage, { parse_mode: 'HTML' });
  });

  // --- Admin Commands ---
  bot.command('admin', async (ctx) => {
    if (ctx.from.id.toString() !== adminId) {
      return ctx.reply('❌ Unauthorized. Admin only.');
    }
    await ctx.reply('🛠️ <b>Production Admin Panel</b>', {
      parse_mode: 'HTML',
      ...getAdminPanel()
    });
  });

  // --- Actions ---
  bot.action('admin_update_info', async (ctx) => {
    if (ctx.from.id.toString() !== adminId) return;
    await ctx.answerCbQuery();
    await ctx.reply('📝 <b>Update App Info</b>\n\nPaste the full JSON object to update current info.', { parse_mode: 'HTML' });
    ctx.session = { waiting_for: 'app_info' };
  });

  bot.action('admin_update_faq', async (ctx) => {
    if (ctx.from.id.toString() !== adminId) return;
    await ctx.answerCbQuery();
    await ctx.reply('❓ <b>Update FAQ</b>\n\nPaste the FAQ array as JSON.', { parse_mode: 'HTML' });
    ctx.session = { waiting_for: 'faq' };
  });

  bot.action('admin_announce', async (ctx) => {
    if (ctx.from.id.toString() !== adminId) return;
    await ctx.answerCbQuery();
    await ctx.reply('📢 <b>Announcement</b>\n\nSend the message you want to post to the channel.', { parse_mode: 'HTML' });
    ctx.session = { waiting_for: 'announcement' };
  });

  bot.action('admin_update_memory', async (ctx) => {
    if (ctx.from.id.toString() !== adminId) return;
    await ctx.answerCbQuery();
    const currentMemory = await db.getMemory();
    await ctx.reply(`🧠 <b>Update Global Memory</b>\n\n<b>Current Memory:</b>\n<i>${currentMemory}</i>\n\nSend the new persistent context/memory for the bot:`, { parse_mode: 'HTML' });
    ctx.session = { waiting_for: 'memory' };
  });

  bot.action('admin_stats', async (ctx) => {
    if (ctx.from.id.toString() !== adminId) return;
    const stats = await db.getStats();
    const statsMessage = `
📊 <b>Bot Statistics</b>

• Messages: <code>${stats.messages_processed}</code>
• Total Users: <code>${stats.users_helped}</code>
• Releases Sent: <code>${stats.releases_announced}</code>

<b>Status:</b> ✅ Operational
`.trim();
    await ctx.editMessageText(statsMessage, { parse_mode: 'HTML', ...getAdminPanel() });
  });

  bot.action('admin_check_releases', async (ctx) => {
    if (ctx.from.id.toString() !== adminId) return;
    await ctx.answerCbQuery('Checking...');
    
    try {
      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
      const releases = await octokit.rest.repos.listReleases({ owner: 'KenzBilal', repo: 'HumanoidCodeLab', per_page: 1 });
      
      if (releases.data.length > 0) {
        const latest = releases.data[0];
        const msg = `🚀 <b>Latest Release found: ${latest.tag_name}</b>\n\n<a href="${latest.html_url}">View on GitHub</a>`;
        await ctx.reply(msg, { parse_mode: 'HTML' });
      } else {
        await ctx.reply('✅ Up to date.');
      }
    } catch (err) {
      await ctx.reply(`❌ Release check failed: ${err.message}`);
    }
  });

  bot.action('admin_close', (ctx) => ctx.deleteMessage());

  // --- Message Handling (Sessions & AI) ---
  bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    const session = ctx.session || {};

    // 1. Handle Admin Inputs (Waiting Sessions)
    if (session.waiting_for) {
      if (ctx.from.id.toString() !== adminId) {
        ctx.session = {}; // Clear session if unauthorized
        return;
      }

      const type = session.waiting_for;
      ctx.session = {}; // Clear session immediately

      try {
        if (type === 'app_info') {
          const data = AppInfoSchema.parse(JSON.parse(text));
          await db.updateAppInfo(data);
          return ctx.reply('✅ App Info updated successfully.');
        } 
        
        if (type === 'faq') {
          const data = FAQSchema.parse(JSON.parse(text));
          await db.updateFAQ(data);
          return ctx.reply('✅ FAQ updated successfully.');
        }

        if (type === 'announcement') {
          const channelId = process.env.CHANNEL_ID;
          await ctx.telegram.sendMessage(channelId, `📢 <b>ANNOUNCEMENT</b>\n\n${text}`, { parse_mode: 'HTML' });
          return ctx.reply('✅ Announcement posted.');
        }

        if (type === 'memory') {
          await db.updateMemory(text);
          return ctx.reply('✅ Global Memory updated.');
        }
      } catch (err) {
        return ctx.reply(`❌ Validation failed: ${err.message}`);
      }
    }

    // 2. Natural Language AI Processing
    if (text.startsWith('/')) return; // Fallback safety

    await db.updateStats('message');
    const context = await db.getFullContext();
    const response = await ai.generateResponse(text, context);
    
    await ctx.reply(response, { parse_mode: 'HTML' });
  });

  bot.catch((err, ctx) => {
    console.error(`💥 Bot Error (${ctx.updateType}):`, err);
    ctx.reply('❌ Internal Error. Please try again later.');
  });
}

module.exports = { registerHandlers };
