const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🤖 AI Community Assistant - Help')
      .setDescription('Your AI-powered community management companion')
      .addFields(
        {
          name: '💬 AI Chat',
          value: '`/ask` - Ask the AI anything\n`/translate` - Translate text to another language',
          inline: false
        },
        {
          name: '📚 Knowledge Base',
          value: '`/learn` - Teach the AI new responses (Admin)',
          inline: false
        },
        {
          name: '👋 Community',
          value: '`/welcome-config` - Configure welcome messages (Admin)\n`/community-stats` - View engagement stats (Admin)',
          inline: false
        },
        {
          name: '🛡️ Moderation',
          value: '`/moderation-config` - Configure AI moderation (Admin)\n`/summarize` - Summarize channel messages (Mod)',
          inline: false
        }
      )
      .setFooter({ text: 'Use / before each command • Admin commands require Administrator permission' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
