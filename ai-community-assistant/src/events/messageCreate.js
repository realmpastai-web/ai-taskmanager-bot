const logger = require('../utils/logger');

module.exports = {
  name: 'messageCreate',

  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;
    
    // Ignore DMs
    if (!message.guild) return;
    
    try {
      // Update message count stats
      client.db.incrementStat(message.guild.id, 'message_count');
      
      // Get moderation config
      const modConfig = client.db.getModerationConfig(message.guild.id);
      
      if (!modConfig) return;
      
      // Check for spam (simple implementation)
      if (modConfig.spam_detection) {
        const isSpam = checkSpam(message, client);
        
        if (isSpam) {
          logger.warn(`Spam detected from ${message.author.tag}: "${message.content.substring(0, 50)}..."`);
          
          if (modConfig.auto_delete_spam) {
            await message.delete();
            
            // Send warning
            const warning = await message.channel.send({
              content: `⚠️ <@${message.author.id}> Your message was flagged as spam. Please avoid sending repetitive messages.`,
            });
            
            setTimeout(() => warning.delete().catch(() => {}), 5000);
          }
          
          // Log to mod channel
          if (modConfig.log_channel_id) {
            const logChannel = message.guild.channels.cache.get(modConfig.log_channel_id);
            if (logChannel) {
              logChannel.send({
                content: `🚨 **Spam Detected**\nUser: ${message.author.tag} (${message.author.id})\nChannel: <#${message.channel.id}>\nContent: ${message.content.substring(0, 500)}`,
              });
            }
          }
        }
      }
      
    } catch (error) {
      logger.error('Error in messageCreate event:', error);
    }
  },
};

// Simple spam detection
const userMessageCache = new Map();

function checkSpam(message, client) {
  const userId = message.author.id;
  const now = Date.now();
  
  if (!userMessageCache.has(userId)) {
    userMessageCache.set(userId, []);
  }
  
  const userMessages = userMessageCache.get(userId);
  
  // Add current message
  userMessages.push({
    content: message.content,
    timestamp: now,
  });
  
  // Clean old messages (older than 10 seconds)
  const cutoff = now - 10000;
  const recentMessages = userMessages.filter(m => m.timestamp > cutoff);
  userMessageCache.set(userId, recentMessages);
  
  // Check for spam indicators
  if (recentMessages.length >= 5) {
    // 5+ messages in 10 seconds
    return true;
  }
  
  // Check for repetitive content
  if (recentMessages.length >= 3) {
    const contents = recentMessages.map(m => m.content.toLowerCase().trim());
    const uniqueContents = [...new Set(contents)];
    
    // If 3+ identical messages
    if (uniqueContents.length === 1 && recentMessages.length >= 3) {
      return true;
    }
  }
  
  return false;
}
