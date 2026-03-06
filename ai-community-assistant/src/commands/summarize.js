const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const OpenAI = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summarize')
    .setDescription('Summarize recent messages in a channel')
    .addIntegerOption(option =>
      option
        .setName('messages')
        .setDescription('Number of messages to summarize (default: 50)')
        .setMinValue(10)
        .setMaxValue(200)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const messageCount = interaction.options.getInteger('messages') || 50;
    
    await interaction.deferReply({ ephemeral: true });
    
    try {
      // Fetch messages
      const messages = await interaction.channel.messages.fetch({ limit: messageCount });
      
      // Filter out bot messages and format
      const messageTexts = messages
        .filter(m => !m.author.bot)
        .map(m => `${m.author.username}: ${m.content}`)
        .reverse()
        .join('\n');
      
      if (!messageTexts) {
        return interaction.editReply({
          content: '❌ No messages found to summarize.',
        });
      }
      
      // Use OpenAI to summarize
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Summarize the following Discord conversation into 3-5 bullet points. Focus on key topics, decisions, and action items.'
          },
          {
            role: 'user',
            content: messageTexts.substring(0, 4000) // Limit context
          }
        ],
        temperature: 0.5,
        max_tokens: 500,
      });
      
      const summary = completion.choices[0].message.content;
      
      const embed = new EmbedBuilder()
        .setColor(0x00AAFF)
        .setTitle('📝 Channel Summary')
        .setDescription(summary)
        .setFooter({ text: `Summarized ${messages.size} messages` })
        .setTimestamp();
      
      await interaction.editReply({ embeds: [embed] });
      
      logger.info(`${interaction.user.tag} summarized ${messages.size} messages in #${interaction.channel.name}`);
      
    } catch (error) {
      logger.error('Error in summarize command:', error);
      await interaction.editReply({
        content: '❌ Failed to summarize messages. Please try again.',
      });
    }
  },
};
