const OpenAI = require('openai');

class AIService {
  constructor() {
    this.apiKey = process.env.AI_API_KEY;
    this.baseURL = process.env.AI_BASE_URL || 'https://api.deepseek.com'; // Default to DeepSeek
    this.modelName = process.env.AI_MODEL || 'deepseek-chat'; // Default to DeepSeek Chat
    
    this.client = this.apiKey ? new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseURL
    }) : null;
  }

  /**
   * Generates a context-aware response using an OpenAI-compatible API (Grok/DeepSeek)
   */
  async generateResponse(userMessage, context) {
    if (!this.client) {
      console.warn(`⚠️ AI API key missing for ${this.modelName}. Using keyword-based fallback.`);
      return this.keywordFallback(userMessage, context);
    }

    try {
      const prompt = this.buildSystemPrompt(context);
      
      const completion = await this.client.chat.completions.create({
        model: this.modelName,
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error(`❌ AI Error (${this.modelName}):`, error.message);
      return this.keywordFallback(userMessage, context);
    }
  }

  /**
   * Constructs the system prompt for context setting
   */
  buildSystemPrompt(kb) {
    const memory = kb.memory || 'No specific identity set.';
    
    return `
You are an AI assistant powered by the "Global Memory" provided by your administrator.
Your core identity, personality, and current status are defined by this memory.

--- 
PRIMARY DIRECTIVES (Administratively Set):
${memory}
---

KNOWLEDGE BASE:
App Info: ${kb.app_info.name} - ${kb.app_info.description}
Features: ${kb.app_info.features.join(', ')}
FAQ:
${kb.faq.map(item => `Q: ${item.q}\nA: ${item.a}`).join('\n\n')}

---

INSTRUCTIONS:
1. **PRIMARY DIRECTIVES**: This is your law. If it says your name is "X", then "X" is your only name. If it says you are "funny", be funny.
2. **Identity**: If a user asks who you are, what your name is, or what you do, answer ONLY based on the PRIMARY DIRECTIVES.
3. **Greeting**: Use the tone specified in the directives. If none is specified, stay professional and concise.
4. **Format**: Always use HTML tags (<b>, <i>, <a>) for beautiful Telegram formatting.
5. **Scope**: Do not mention you are an AI or a "large language model" unless the directives tell you to. Stay in character!
`.trim();
  }

  /**
   * Fallback logic for basic keyword matching
   */
  keywordFallback(userMessage, kb) {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('feature') || lowerMsg.includes('what can')) {
      return `🚀 <b>HumanoidCodeLab Features:</b>\n\n${kb.app_info.features.map(f => `• ${f}`).join('\n')}`;
    }
    
    if (lowerMsg.includes('download') || lowerMsg.includes('install') || lowerMsg.includes('get started')) {
      return `📥 <b>Get Started:</b>\n\nDownload HumanoidCodeLab from:\n<a href="${kb.app_info.github}">${kb.app_info.github}</a>\n\nSupported: ${kb.app_info.platforms.join(', ')}`;
    }
    
    if (lowerMsg.includes('ai') || lowerMsg.includes('generate') || lowerMsg.includes('script')) {
      return `🤖 <b>AI Script Generation:</b>\n\nHumanoidCodeLab supports OpenAI, Anthropic, and other advanced models. Use natural language to generate robot scripts!`;
    }
    
    if (lowerMsg.includes('help') || lowerMsg.includes('support') || lowerMsg.includes('issue')) {
      return `💬 <b>Need Help?</b>\n\n📧 Email: ${kb.app_info.email}\n🔗 <a href="${kb.app_info.github}/issues">GitHub Issues</a>`;
    }

    return `👋 Hi! I'm Humanoid. I can help you with features, installation, AI scripting, and FAQs about HumanoidCodeLab. What would you like to know?`;
  }
}

module.exports = new AIService();
