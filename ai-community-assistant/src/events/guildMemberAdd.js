const logger = require('../utils/logger');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  name: 'guildMemberAdd',

  async execute(member, client) {
    try {
      // Get welcome config
      const config = client.db.getWelcomeConfig(member.guild.id);
      
      if (!config || !config.enabled) return;
      
      const channel = member.guild.channels.cache.get(config.channel_id);
      if (!channel) return;
      
      let welcomeMessage;
      
      if (config.use_ai) {
        // Generate AI welcome message
        try {
          const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4',
            messages: [
              {
                role: 'system',
                content: `You are a welcoming community assistant. Write a warm, friendly welcome message for a new member joining the Discord server "${member.guild.name}". Keep it under 200 characters and include their username.`
              }
            ],
            temperature: 0.8,
            max_tokens: 100,
          });
          
          welcomeMessage = completion.choices[0].message.content;
        } catch (aiError) {
          logger.error('AI welcome generation failed:', aiError);
          welcomeMessage = null;
        }
      }
      
      // Fallback to custom message or default
      if (!welcomeMessage) {
        if (config.custom_message) {
          welcomeMessage = config.custom_message.replace('{user}', `<@${member.id}>`);
        } else {
          welcomeMessage = `👋 Welcome to **${member.guild.name}**, <@${member.id}>! We're glad to have you here. Feel free to ask me anything with "/ask"!`;
        }
      } else {
        // Replace {user} in AI message too
        welcomeMessage = welcomeMessage.replace('{user}', `<@${member.id}>`);
        // Ensure user mention is included
        if (!welcomeMessage.includes(`<@${member.id}>`)) {
          welcomeMessage = `<@${member.id}> ${welcomeMessage}`;
        }
      }
      
      await channel.send(welcomeMessage);
      
      // Update stats
      client.db.incrementStat(member.guild.id, 'new_members');
      
      logger.info(`Welcomed ${member.user.tag} to ${member.guild.name}`);
      
    } catch (error) {
      logger.error('Error in guildMemberAdd event:', error);
    }
  },
};
