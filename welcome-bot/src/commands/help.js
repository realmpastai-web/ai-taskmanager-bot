const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows information about the bot and available commands'),

  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('🤖 Welcome Bot - Help')
      .setDescription('A professional welcome bot for your Discord server!')
      .addFields(
        {
          name: '📋 Available Commands',
          value: `
            \`/help\` - Show this help message
            \`/config\` - View current configuration
            \`/testwelcome\` - Test the welcome message (Admin only)
          `
        },
        {
          name: '✨ Features',
          value: `
            • Welcome messages with user info
            • Leave notifications
            • Auto-role assignment
            • DM welcome messages
            • Member count tracking
          `
        },
        {
          name: '⚙️ Configuration',
          value: 'Set these environment variables:\n\`
            DISCORD_TOKEN, WELCOME_CHANNEL_ID, AUTO_ROLE_ID, DM_WELCOME_ENABLED
          \`' 
        },
        {
          name: '💎 Premium Features',
          value: 'Coming soon: Custom welcome cards, image backgrounds, role menus, and more!'
        }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  }
};
