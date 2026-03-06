const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moderation-config')
    .setDescription('Configure AI moderation settings')
    .addBooleanOption(option =>
      option
        .setName('toxicity-detection')
        .setDescription('Enable AI toxicity detection')
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName('spam-detection')
        .setDescription('Enable spam detection')
        .setRequired(false)
    )
    .addBooleanOption(option =>
      option
        .setName('auto-delete-spam')
        .setDescription('Automatically delete detected spam')
        .setRequired(false)
    )
    .addChannelOption(option =>
      option
        .setName('log-channel')
        .setDescription('Channel for moderation logs')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addNumberOption(option =>
      option
        .setName('toxicity-threshold')
        .setDescription('Toxicity threshold (0.0 - 1.0, default: 0.7)')
        .setMinValue(0)
        .setMaxValue(1)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const toxicityDetection = interaction.options.getBoolean('toxicity-detection');
    const spamDetection = interaction.options.getBoolean('spam-detection');
    const autoDeleteSpam = interaction.options.getBoolean('auto-delete-spam');
    const logChannel = interaction.options.getChannel('log-channel');
    const toxicityThreshold = interaction.options.getNumber('toxicity-threshold');
    
    try {
      // Get current config
      const currentConfig = client.db.getModerationConfig(interaction.guildId) || {};
      
      // Build config object
      const config = {
        toxicityDetection: toxicityDetection !== null ? toxicityDetection : currentConfig.toxicity_detection,
        spamDetection: spamDetection !== null ? spamDetection : currentConfig.spam_detection,
        autoDeleteSpam: autoDeleteSpam !== null ? autoDeleteSpam : currentConfig.auto_delete_spam,
        logChannelId: logChannel?.id || currentConfig.log_channel_id,
        toxicityThreshold: toxicityThreshold || currentConfig.toxicity_threshold || 0.7,
      };
      
      // Save to database
      client.db.setModerationConfig(interaction.guildId, config);
      
      const embed = new EmbedBuilder()
        .setColor(0xFF5500)
        .setTitle('🛡️ Moderation Configuration Updated')
        .addFields(
          { name: 'Toxicity Detection', value: config.toxicityDetection ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: 'Spam Detection', value: config.spamDetection ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: 'Auto-Delete Spam', value: config.autoDeleteSpam ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: 'Log Channel', value: logChannel ? `<#${logChannel.id}>` : (currentConfig.log_channel_id ? `<#${currentConfig.log_channel_id}>` : 'Not set'), inline: true },
          { name: 'Toxicity Threshold', value: config.toxicityThreshold.toString(), inline: true }
        );
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      
      logger.info(`${interaction.user.tag} updated moderation config for guild ${interaction.guildId}`);
      
    } catch (error) {
      logger.error('Error in moderation-config command:', error);
      await interaction.reply({
        content: '❌ Failed to update moderation configuration.',
        ephemeral: true,
      });
    }
  },
};
