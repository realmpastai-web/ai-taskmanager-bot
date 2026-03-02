const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member, client) {
    try {
      console.log(`👋 Member left: ${member.user.tag} from ${member.guild.name}`);

      const leaveChannelId = process.env.LEAVE_CHANNEL_ID || process.env.WELCOME_CHANNEL_ID;

      if (leaveChannelId) {
        const leaveChannel = member.guild.channels.cache.get(leaveChannelId);
        if (leaveChannel) {
          const leaveEmbed = new EmbedBuilder()
            .setColor(0xFF5555)
            .setTitle('👋 Goodbye!')
            .setDescription(`${member.user.tag} has left the server.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
              { name: '📊 Remaining Members', value: `${member.guild.memberCount}`, inline: true },
              { name: '⏱️ Was here for', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true }
            )
            .setTimestamp();

          await leaveChannel.send({ embeds: [leaveEmbed] });
          console.log(`   ✅ Leave message sent to #${leaveChannel.name}`);
        }
      }
    } catch (error) {
      console.error('❌ Error in guildMemberRemove event:', error);
    }
  }
};
