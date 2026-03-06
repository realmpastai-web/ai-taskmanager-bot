const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('community-stats')
    .setDescription('View community engagement statistics')
    .addIntegerOption(option =>
      option
        .setName('days')
        .setDescription('Number of days to show (default: 7)')
        .setMinValue(1)
        .setMaxValue(90)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const days = interaction.options.getInteger('days') || 7;
    
    try {
      const stats = client.db.getStats(interaction.guildId, days);
      
      if (!stats || stats.length === 0) {
        return interaction.reply({
          content: '📊 No statistics available yet. Stats are collected daily.',
          ephemeral: true,
        });
      }
      
      // Calculate totals
      const totals = stats.reduce((acc, day) => ({
        messages: acc.messages + (day.total_messages || 0),
        activeUsers: acc.activeUsers + (day.total_active_users || 0),
        newMembers: acc.newMembers + (day.total_new_members || 0),
        questions: acc.questions + (day.total_questions || 0),
      }), { messages: 0, activeUsers: 0, newMembers: 0, questions: 0 });
      
      // Calculate averages
      const avgMessages = Math.round(totals.messages / stats.length);
      const avgQuestions = Math.round(totals.questions / stats.length);
      
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(`📊 Community Stats (Last ${days} Days)`)
        .addFields(
          { name: 'Total Messages', value: totals.messages.toLocaleString(), inline: true },
          { name: 'Avg Messages/Day', value: avgMessages.toLocaleString(), inline: true },
          { name: 'New Members', value: totals.newMembers.toLocaleString(), inline: true },
          { name: 'Questions Answered', value: totals.questions.toLocaleString(), inline: true },
          { name: 'Avg Questions/Day', value: avgQuestions.toLocaleString(), inline: true },
          { name: 'Active Users (Total)', value: totals.activeUsers.toLocaleString(), inline: true }
        )
        .setFooter({ text: `Data collected from ${stats.length} days` })
        .setTimestamp();
      
      // Add recent activity graph (text-based)
      const recentStats = stats.slice(0, 7);
      let graphText = '';
      
      recentStats.forEach(day => {
        const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        const bar = '█'.repeat(Math.min(day.total_messages / 100, 20));
        graphText += `${date}: ${bar} ${day.total_messages}\n`;
      });
      
      if (graphText) {
        embed.addFields({ name: '📈 Recent Activity', value: '```\n' + graphText + '```' });
      }
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      
      logger.info(`${interaction.user.tag} viewed community stats for guild ${interaction.guildId}`);
      
    } catch (error) {
      logger.error('Error in community-stats command:', error);
      await interaction.reply({
        content: '❌ Failed to retrieve community statistics.',
        ephemeral: true,
      });
    }
  },
};
