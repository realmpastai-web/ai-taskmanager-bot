const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testwelcome')
    .setDescription('Test the welcome message (Admin only)'),

  async execute(interaction) {
    // Check for admin permission
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ You need Administrator permission to use this command.',
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
    if (!welcomeChannelId) {
      return interaction.editReply('❌ WELCOME_CHANNEL_ID is not set in environment variables.');
    }

    const welcomeChannel = interaction.guild.channels.cache.get(welcomeChannelId);
    if (!welcomeChannel) {
      return interaction.editReply('❌ Welcome channel not found. Check your WELCOME_CHANNEL_ID.');
    }

    // Create test welcome embed
    const testEmbed = new EmbedBuilder()
      .setColor(0x00FF88)
      .setTitle('🎉 Welcome to the Server!')
      .setDescription(
        `Hey ${interaction.user}, welcome to **${interaction.guild.name}**!\n\n` +
        `We're glad to have you here. Enjoy your stay! 🚀\n\n` +
        `*(This is a test message)*`
      )
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '📊 Member Count', value: `${interaction.guild.memberCount}`, inline: true },
        { name: '🆔 User ID', value: `${interaction.user.id}`, inline: true },
        { name: '📅 Account Created', value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `User #${interaction.guild.memberCount} • TEST MODE` });

    try {
      await welcomeChannel.send({ embeds: [testEmbed] });
      await interaction.editReply(`✅ Test welcome message sent to <#${welcomeChannelId}>!`);
    } catch (error) {
      console.error('Error sending test welcome:', error);
      await interaction.editReply('❌ Failed to send test message. Check bot permissions.');
    }
  }
};
