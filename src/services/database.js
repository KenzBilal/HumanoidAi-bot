const fs = require('fs');
const path = require('path');
// const { createClient } = require('@supabase/supabase-js'); // Placeholder for future use

const KB_FILE = path.join(__dirname, '../../knowledge_base.json');

class DatabaseManager {
  constructor() {
    this.mode = process.env.DB_MODE || 'json';
    this.kb = null;
    this.initialize();
  }

  /**
   * Initialize the database (JSON or Supabase)
   */
  initialize() {
    if (this.mode === 'json') {
      if (!fs.existsSync(KB_FILE)) {
        this.kb = this.getDefaultKB();
        this.saveKB();
        console.log('📦 JSON Database: Initialized with defaults');
      } else {
        this.loadKB();
      }
    } else if (this.mode === 'supabase') {
      // TODO: Initialize Supabase client
      // this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
      console.log('🚀 Supabase Database: Mode enabled (Placeholders)');
    }
  }

  /**
   * Load JSON KB
   */
  loadKB() {
    try {
      const data = fs.readFileSync(KB_FILE, 'utf8');
      this.kb = JSON.parse(data);
    } catch (error) {
      console.error('❌ Error loading JSON KB:', error);
      this.kb = this.getDefaultKB();
    }
  }

  /**
   * Save JSON KB
   */
  async saveKB() {
    if (this.mode === 'json') {
      try {
        fs.writeFileSync(KB_FILE, JSON.stringify(this.kb, null, 2));
        return true;
      } catch (error) {
        console.error('❌ Error saving JSON KB:', error);
        return false;
      }
    }
    // If Supabase mode, updates would happen per-table
    return true;
  }

  /**
   * Get application information
   */
  async getAppInfo() {
    if (this.mode === 'json') return this.kb.app_info;
    
    // Supabase placeholder
    // const { data } = await this.supabase.from('settings').select('*').single();
    // return data;
    return this.kb.app_info;
  }

  /**
   * Get FAQ items
   */
  async getFAQ() {
    if (this.mode === 'json') return this.kb.faq;
    
    // Supabase placeholder
    // const { data } = await this.supabase.from('faq').select('*');
    // return data;
    return this.kb.faq;
  }

  /**
   * Update app info
   */
  async updateAppInfo(newInfo) {
    if (this.mode === 'json') {
      this.kb.app_info = { ...this.kb.app_info, ...newInfo };
      this.kb.last_updated = new Date().toISOString();
      return this.saveKB();
    }
    return true;
  }

  /**
   * Update FAQ
   */
  async updateFAQ(faqArray) {
    if (this.mode === 'json') {
      this.kb.faq = faqArray;
      this.kb.last_updated = new Date().toISOString();
      return this.saveKB();
    }
    return true;
  }

  /**
   * Update statistics
   */
  async updateStats(type) {
    if (this.mode === 'json') {
      if (type === 'message') this.kb.stats.messages_processed++;
      if (type === 'user') this.kb.stats.users_helped++;
      if (type === 'release') this.kb.stats.releases_announced++;
      this.kb.last_updated = new Date().toISOString();
      return this.saveKB();
    }
    return true;
  }

  /**
   * Get statistics
   */
  async getStats() {
    if (this.mode === 'json') return this.kb.stats;
    return this.kb.stats;
  }

  /**
   * Get Support Topics
   */
  async getSupportTopics() {
    if (this.mode === 'json') return this.kb.support_topics;
    return this.kb.support_topics;
  }

  /**
   * Get all knowledge as a single object (useful for AI context)
   */
  async getFullContext() {
    if (this.mode === 'json') return this.kb;
    return this.kb;
  }

  /**
   * Get global memory details
   */
  async getMemory() {
    if (this.mode === 'json') return this.kb.memory || 'No memory details set yet.';
    return this.kb.memory;
  }

  /**
   * Update global memory details
   */
  async updateMemory(newText) {
    if (this.mode === 'json') {
      this.kb.memory = newText;
      this.kb.last_updated = new Date().toISOString();
      return this.saveKB();
    }
    return true;
  }

  /**
   * Default KB structure
   */
  getDefaultKB() {
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
          'Secure Keychains',
          'Visual Animation Editor',
          'Dynamic Layout'
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
          q: 'Is it free?',
          a: 'Yes, HumanoidCodeLab is free and open-source. You can download it from our GitHub repository.'
        }
      ],
      support_topics: {
        installation: 'Download from GitHub and follow platform-specific installation guides.',
        scripting: 'Use Python-like syntax to control the robot. Example: robot.walk.forward(steps=3)',
        ai_generation: 'Enable AI providers in settings and use natural language to generate scripts.'
      },
      stats: {
        messages_processed: 0,
        users_helped: 0,
        releases_announced: 0
      },
      memory: 'Humanoid AI project is in active development. Focus on community and support.',
      last_updated: new Date().toISOString()
    };
  }
}

module.exports = new DatabaseManager();
