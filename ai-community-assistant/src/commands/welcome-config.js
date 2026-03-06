const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome-config')
    .setDescription('Configure AI welcome messages')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('Channel to send welcome messages')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName('enabled')
        .setDescription('Enable or disable welcome messages')
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName('use-ai')
        .setDescription('Use AI to generate personalized welcomes')
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('custom-message')
        .setDescription('Custom welcome message template (use {user} for username)')
        .setRequired(false)
        .setMaxLength(1000)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel('channel');
    const enabled = interaction.options.getBoolean('enabled');
    const useAi = interaction.options.getBoolean('use-ai');
    const customMessage = interaction.options.getString('custom-message');
    
    try {
      // Get current config
      const currentConfig = client.db.getWelcomeConfig(interaction.guildId) || {};
      
      // Update with new values or keep current
      const newConfig = {
        channelId: channel?.id || currentConfig.channel_id,
        enabled: enabled !== null ? enabled : currentConfig.enabled,
        customMessage: customMessage || currentConfig.custom_message,
        useAi: useAi !== null ? useAi : currentConfig.use_ai,
      };
      
      // Save to database
      client.db.setWelcomeConfig(
        interaction.guildId,
        newConfig.channelId,
        newConfig.enabled,
        newConfig.customMessage,
        newConfig.useAi
      );
      
      const embed = new EmbedBuilder()
        .setColor(0x00AAFF)
        .setTitle('🎉 Welcome Configuration Updated')
        .addFields(
          { name: 'Channel', value: channel ? `<#${channel.id}>` : (currentConfig.channel_id ? `<#${currentConfig.channel_id}>` : 'Not set'), inline: true },
          { name: 'Enabled', value: newConfig.enabled ? '✅ Yes' : '❌ No', inline: true },
          { name: 'Use AI', value: newConfig.useAi ? '✅ Yes' : '❌ No', inline: true }
        );
      
      if (newConfig.customMessage) {
        embed.addFields({ name: 'Custom Message', value: newConfig.customMessage });
      }
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      
      logger.info(`${interaction.user.tag} updated welcome config for guild ${interaction.guildId}`);
      
    } catch (error) {
      logger.error('Error in welcome-config command:', error);
      await interaction.reply({
        content: '❌ Failed to update welcome configuration.',
        ephemeral: true,
      });
    }
  },
};
