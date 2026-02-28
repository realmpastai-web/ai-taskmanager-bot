import { Client, Events, GuildMember, PartialGuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { config } from '../config';

export function execute(client: Client) {
  client.on(Events.GuildMemberRemove, async (member: GuildMember | PartialGuildMember) => {
    try {
      console.log(`👋 Member left: ${member.user.tag} (${member.id})`);
      
      // Send leave message to welcome channel
      const welcomeChannel = member.guild.channels.cache.get(config.channels.welcome) as TextChannel;
      if (welcomeChannel) {
        const leaveMessage = config.messages.leave
          .replace('{username}', member.user.username)
          .replace('{user}', `<@${member.id}>`)
          .replace('{server}', member.guild.name)
          .replace('{count}', member.guild.memberCount.toString());
          
        await welcomeChannel.send(leaveMessage);
        console.log(`   ✅ Leave message sent to #${welcomeChannel.name}`);
      }
      
      // Log to log channel if configured
      if (config.channels.log) {
        const logChannel = member.guild.channels.cache.get(config.channels.log) as TextChannel;
        if (logChannel) {
          const logEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('📤 Member Left')
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
              { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
              { name: 'Joined Server', value: member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:R>` : 'Unknown', inline: true },
              { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true }
            )
            .setTimestamp();
            
          await logChannel.send({ embeds: [logEmbed] });
          console.log(`   ✅ Log entry sent to #${logChannel.name}`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Error handling member leave for ${member.user.tag}:`, error);
    }
  });
}