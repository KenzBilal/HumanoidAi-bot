const fs = require('fs');
const path = require('path');

const KB_FILE = path.join(__dirname, 'knowledge_base.json');

class ConfigManager {
  /**
   * Load knowledge base from file
   */
  static loadKB() {
    try {
      return JSON.parse(fs.readFileSync(KB_FILE, 'utf8'));
    } catch (error) {
      console.error('Error loading KB:', error);
      return this.getDefaultKB();
    }
  }

  /**
   * Save knowledge base to file
   */
  static saveKB(kb) {
    try {
      fs.writeFileSync(KB_FILE, JSON.stringify(kb, null, 2));
      console.log('✅ Knowledge base saved');
      return true;
    } catch (error) {
      console.error('Error saving KB:', error);
      return false;
    }
  }

  /**
   * Get default knowledge base structure
   */
  static getDefaultKB() {
    return {
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
  }

  /**
   * Update app info
   */
  static updateAppInfo(newInfo) {
    const kb = this.loadKB();
    kb.app_info = { ...kb.app_info, ...newInfo };
    kb.last_updated = new Date().toISOString();
    return this.saveKB(kb);
  }

  /**
   * Update FAQ
   */
  static updateFAQ(faqArray) {
    const kb = this.loadKB();
    if (Array.isArray(faqArray)) {
      kb.faq = faqArray;
      kb.last_updated = new Date().toISOString();
      return this.saveKB(kb);
    }
    return false;
  }

  /**
   * Add FAQ item
   */
  static addFAQItem(question, answer) {
    const kb = this.loadKB();
    kb.faq.push({ q: question, a: answer });
    kb.last_updated = new Date().toISOString();
    return this.saveKB(kb);
  }

  /**
   * Remove FAQ item by index
   */
  static removeFAQItem(index) {
    const kb = this.loadKB();
    if (index >= 0 && index < kb.faq.length) {
      kb.faq.splice(index, 1);
      kb.last_updated = new Date().toISOString();
      return this.saveKB(kb);
    }
    return false;
  }

  /**
   * Update support topic
   */
  static updateSupportTopic(topic, description) {
    const kb = this.loadKB();
    kb.support_topics[topic] = description;
    kb.last_updated = new Date().toISOString();
    return this.saveKB(kb);
  }

  /**
   * Get formatted app info for display
   */
  static formatAppInfo(kb) {
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

  /**
   * Get formatted FAQ for display
   */
  static formatFAQ(kb) {
    return kb.faq.map((item, i) => 
      `<b>Q${i + 1}: ${item.q}</b>\nA: ${item.a}`
    ).join('\n\n');
  }

  /**
   * Update statistics
   */
  static updateStats(type) {
    const kb = this.loadKB();
    if (type === 'message') kb.stats.messages_processed++;
    if (type === 'user') kb.stats.users_helped++;
    if (type === 'release') kb.stats.releases_announced++;
    kb.last_updated = new Date().toISOString();
    this.saveKB(kb);
  }

  /**
   * Get formatted statistics
   */
  static formatStats(kb) {
    return `
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
  }

  /**
   * Export knowledge base as JSON
   */
  static exportKB() {
    const kb = this.loadKB();
    return JSON.stringify(kb, null, 2);
  }

  /**
   * Import knowledge base from JSON
   */
  static importKB(jsonString) {
    try {
      const kb = JSON.parse(jsonString);
      kb.last_updated = new Date().toISOString();
      return this.saveKB(kb);
    } catch (error) {
      console.error('Error importing KB:', error);
      return false;
    }
  }

  /**
   * Validate knowledge base structure
   */
  static validateKB(kb) {
    const required = ['app_info', 'faq', 'support_topics', 'stats'];
    return required.every(field => field in kb);
  }

  /**
   * Create backup of knowledge base
   */
  static backupKB() {
    try {
      const kb = this.loadKB();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(__dirname, `knowledge_base.backup.${timestamp}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(kb, null, 2));
      console.log(`✅ Backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error('Error creating backup:', error);
      return null;
    }
  }

  /**
   * Restore knowledge base from backup
   */
  static restoreFromBackup(backupFile) {
    try {
      const kb = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
      if (this.validateKB(kb)) {
        return this.saveKB(kb);
      }
      console.error('Invalid backup file structure');
      return false;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }

  /**
   * Initialize knowledge base if it doesn't exist
   */
  static initialize() {
    if (!fs.existsSync(KB_FILE)) {
      const defaultKB = this.getDefaultKB();
      this.saveKB(defaultKB);
      console.log('✅ Knowledge base initialized with defaults');
      return true;
    }
    return false;
  }
}

module.exports = ConfigManager;
