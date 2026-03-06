const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const OpenAI = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask the AI community assistant anything')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Your question for the AI')
        .setRequired(true)
        .setMaxLength(1000)
    ),

  async execute(interaction, client) {
    const question = interaction.options.getString('question');
    
    await interaction.deferReply();
    
    try {
      // Check knowledge base first
      const knowledge = client.db.getKnowledge(interaction.guildId, question);
      
      let response;
      
      if (knowledge) {
        // Use knowledge base response
        response = knowledge.response;
      } else {
        // Use OpenAI for response
        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a helpful community assistant for Discord server "${interaction.guild.name}". 
Be friendly, concise, and helpful. Keep responses under 500 characters when possible.
If you don't know something, say so honestly.`
            },
            {
              role: 'user',
              content: question
            }
          ],
          temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
          max_tokens: parseInt(process.env.MAX_RESPONSE_LENGTH) || 500,
        });
        
        response = completion.choices[0].message.content;
      }
      
      // Save conversation
      client.db.saveConversation(
        interaction.user.id,
        interaction.guildId,
        interaction.channelId,
        question,
        response
      );
      
      // Increment stats
      client.db.incrementStat(interaction.guildId, 'questions_answered');
      
      await interaction.editReply({
        content: `**Q:** ${question}\n\n**A:** ${response}`,
      });
      
      logger.info(`AI answered question from ${interaction.user.tag}: "${question.substring(0, 50)}..."`);
      
    } catch (error) {
      logger.error('Error in ask command:', error);
      await interaction.editReply({
        content: '❌ Sorry, I encountered an error processing your question. Please try again later.',
      });
    }
  },
};
