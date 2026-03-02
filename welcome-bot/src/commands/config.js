const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('View current bot configuration'),

  async execute(interaction) {
    // Only allow guild administrators to view config
    if (!interaction.memberPermissions?.has('Administrator')) {
      return interaction.reply({
        content: '❌ You need Administrator permission to view configuration.',
        ephemeral: true
      });
    }

    const configEmbed = new EmbedBuilder()
      .setColor(0xFFA500)
      .setTitle('⚙️ Bot Configuration')
      .addFields(
        { 
          name: 'Welcome Channel', 
          value: process.env.WELCOME_CHANNEL_ID ? `<#${process.env.WELCOME_CHANNEL_ID}>` : '❌ Not set',
          inline: true 
        },
        { 
          name: 'Leave Channel', 
          value: process.env.LEAVE_CHANNEL_ID ? `<#${process.env.LEAVE_CHANNEL_ID}>` : '❌ Not set (using welcome channel)',
          inline: true 
        },
        { 
          name: 'Auto Role', 
          value: process.env.AUTO_ROLE_ID ? `<@&${process.env.AUTO_ROLE_ID}>` : '❌ Not set',
          inline: true 
        },
        { 
          name: 'DM Welcome', 
          value: process.env.DM_WELCOME_ENABLED === 'true' ? '✅ Enabled' : '❌ Disabled',
          inline: true 
        }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [configEmbed], ephemeral: true });
  }
};
