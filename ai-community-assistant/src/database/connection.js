const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

class Connection {
  constructor() {
    const dbPath = process.env.DATABASE_PATH || './data/bot.db';
    const dataDir = path.dirname(dbPath);
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    
    this.initTables();
    logger.info('Database initialized');
  }
  
  initTables() {
    // Knowledge base table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS knowledge_base (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        keyword TEXT NOT NULL,
        response TEXT NOT NULL,
        created_by TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Conversation context table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT,
        channel_id TEXT NOT NULL,
        message TEXT NOT NULL,
        response TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Welcome config table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS welcome_config (
        guild_id TEXT PRIMARY KEY,
        channel_id TEXT,
        enabled BOOLEAN DEFAULT 0,
        custom_message TEXT,
        use_ai BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Moderation config table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS moderation_config (
        guild_id TEXT PRIMARY KEY,
        toxicity_detection BOOLEAN DEFAULT 1,
        spam_detection BOOLEAN DEFAULT 1,
        auto_delete_spam BOOLEAN DEFAULT 0,
        log_channel_id TEXT,
        toxicity_threshold REAL DEFAULT 0.7,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Community stats table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS community_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        date DATE DEFAULT CURRENT_DATE,
        message_count INTEGER DEFAULT 0,
        active_users INTEGER DEFAULT 0,
        new_members INTEGER DEFAULT 0,
        questions_answered INTEGER DEFAULT 0,
        UNIQUE(guild_id, date)
      )
    `);
    
    // Create indexes
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_knowledge_guild ON knowledge_base(guild_id)`);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_knowledge_keyword ON knowledge_base(keyword)`);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id)`);
    this.db.exec(`CREATE INDEX IF NOT EXISTS idx_stats_guild_date ON community_stats(guild_id, date)`);
  }
  
  // Knowledge Base Methods
  addKnowledge(guildId, keyword, response, createdBy) {
    const stmt = this.db.prepare(`
      INSERT INTO knowledge_base (guild_id, keyword, response, created_by)
      VALUES (?, ?, ?, ?)
      ON CONFLICT DO UPDATE SET
        response = excluded.response,
        updated_at = CURRENT_TIMESTAMP
    `);
    return stmt.run(guildId, keyword.toLowerCase(), response, createdBy);
  }
  
  getKnowledge(guildId, keyword) {
    const stmt = this.db.prepare(`
      SELECT * FROM knowledge_base 
      WHERE guild_id = ? AND keyword LIKE ?
    `);
    return stmt.get(guildId, `%${keyword.toLowerCase()}%`);
  }
  
  getAllKnowledge(guildId) {
    const stmt = this.db.prepare(`
      SELECT * FROM knowledge_base WHERE guild_id = ? ORDER BY keyword
    `);
    return stmt.all(guildId);
  }
  
  deleteKnowledge(id) {
    const stmt = this.db.prepare('DELETE FROM knowledge_base WHERE id = ?');
    return stmt.run(id);
  }
  
  // Conversation Methods
  saveConversation(userId, guildId, channelId, message, response) {
    const stmt = this.db.prepare(`
      INSERT INTO conversations (user_id, guild_id, channel_id, message, response)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(userId, guildId, channelId, message, response);
  }
  
  getRecentConversations(userId, limit = 10) {
    const stmt = this.db.prepare(`
      SELECT * FROM conversations 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }
  
  // Welcome Config Methods
  setWelcomeConfig(guildId, channelId, enabled, customMessage, useAi) {
    const stmt = this.db.prepare(`
      INSERT INTO welcome_config (guild_id, channel_id, enabled, custom_message, use_ai)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(guild_id) DO UPDATE SET
        channel_id = excluded.channel_id,
        enabled = excluded.enabled,
        custom_message = excluded.custom_message,
        use_ai = excluded.use_ai,
        updated_at = CURRENT_TIMESTAMP
    `);
    return stmt.run(guildId, channelId, enabled ? 1 : 0, customMessage, useAi ? 1 : 0);
  }
  
  getWelcomeConfig(guildId) {
    const stmt = this.db.prepare('SELECT * FROM welcome_config WHERE guild_id = ?');
    return stmt.get(guildId);
  }
  
  // Moderation Config Methods
  setModerationConfig(guildId, config) {
    const stmt = this.db.prepare(`
      INSERT INTO moderation_config (
        guild_id, toxicity_detection, spam_detection, auto_delete_spam,
        log_channel_id, toxicity_threshold
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(guild_id) DO UPDATE SET
        toxicity_detection = excluded.toxicity_detection,
        spam_detection = excluded.spam_detection,
        auto_delete_spam = excluded.auto_delete_spam,
        log_channel_id = excluded.log_channel_id,
        toxicity_threshold = excluded.toxicity_threshold,
        updated_at = CURRENT_TIMESTAMP
    `);
    return stmt.run(
      guildId,
      config.toxicityDetection ? 1 : 0,
      config.spamDetection ? 1 : 0,
      config.autoDeleteSpam ? 1 : 0,
      config.logChannelId,
      config.toxicityThreshold
    );
  }
  
  getModerationConfig(guildId) {
    const stmt = this.db.prepare('SELECT * FROM moderation_config WHERE guild_id = ?');
    return stmt.get(guildId);
  }
  
  // Stats Methods
  incrementStat(guildId, statType) {
    const validStats = ['message_count', 'active_users', 'new_members', 'questions_answered'];
    if (!validStats.includes(statType)) return;
    
    const stmt = this.db.prepare(`
      INSERT INTO community_stats (guild_id, ${statType})
      VALUES (?, 1)
      ON CONFLICT(guild_id, date) DO UPDATE SET
        ${statType} = ${statType} + 1
    `);
    return stmt.run(guildId);
  }
  
  getStats(guildId, days = 30) {
    const stmt = this.db.prepare(`
      SELECT 
        date,
        SUM(message_count) as total_messages,
        SUM(active_users) as total_active_users,
        SUM(new_members) as total_new_members,
        SUM(questions_answered) as total_questions
      FROM community_stats
      WHERE guild_id = ? AND date >= date('now', '-${days} days')
      GROUP BY date
      ORDER BY date DESC
    `);
    return stmt.all(guildId);
  }
  
  close() {
    this.db.close();
  }
}

module.exports = Connection;
