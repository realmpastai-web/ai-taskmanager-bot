const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('learn')
    .setDescription('Teach the AI a new response (Admin only)')
    .addStringOption(option =>
      option
        .setName('keyword')
        .setDescription('The keyword or phrase to trigger this response')
        .setRequired(true)
        .setMaxLength(100)
    )
    .addStringOption(option =>
      option
        .setName('response')
        .setDescription('The response the AI should give')
        .setRequired(true)
        .setMaxLength(2000)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const keyword = interaction.options.getString('keyword');
    const response = interaction.options.getString('response');
    
    try {
      // Add to knowledge base
      const result = client.db.addKnowledge(
        interaction.guildId,
        keyword,
        response,
        interaction.user.id
      );
      
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('✅ Knowledge Added')
        .addFields(
          { name: 'Keyword', value: keyword, inline: true },
          { name: 'Response', value: response.substring(0, 500) + (response.length > 500 ? '...' : '') }
        )
        .setTimestamp();
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      
      logger.info(`${interaction.user.tag} added knowledge: "${keyword}"`);
      
    } catch (error) {
      logger.error('Error in learn command:', error);
      await interaction.reply({
        content: '❌ Failed to add knowledge. Please try again.',
        ephemeral: true,
      });
    }
  },
};
