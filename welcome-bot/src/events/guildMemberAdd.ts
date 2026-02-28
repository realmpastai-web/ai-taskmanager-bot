import { Client, Events, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { config } from '../config';
import { formatWelcomeMessage } from '../utils/formatMessage';

export function execute(client: Client) {
  client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
    try {
      console.log(`👋 New member joined: ${member.user.tag} (${member.id})`);
      
      // 1. Send welcome message to welcome channel
      const welcomeChannel = member.guild.channels.cache.get(config.channels.welcome) as TextChannel;
      if (welcomeChannel) {
        const welcomeMessage = formatWelcomeMessage(
          config.messages.welcome,
          member.user,
          member.guild.name,
          member.guild.memberCount
        );
        
        await welcomeChannel.send(welcomeMessage);
        console.log(`   ✅ Welcome message sent to #${welcomeChannel.name}`);
      } else {
        console.warn(`   ⚠️ Welcome channel not found: ${config.channels.welcome}`);
      }
      
      // 2. Assign auto-role if configured
      if (config.roles.autoRole) {
        const role = member.guild.roles.cache.get(config.roles.autoRole);
        if (role) {
          await member.roles.add(role);
          console.log(`   ✅ Auto-role assigned: ${role.name}`);
        } else {
          console.warn(`   ⚠️ Auto-role not found: ${config.roles.autoRole}`);
        }
      }
      
      // 3. Send DM if enabled
      if (config.features.enableDM) {
        try {
          const dmEmbed = new EmbedBuilder()
            .setColor(0x5865F2)
            .setTitle(`Welcome to ${member.guild.name}!`)
            .setDescription(`Hi ${member.user.username}, welcome to the server!`)
            .addFields(
              { name: '👥 Member Count', value: `You are member #${member.guild.memberCount}` },
              { name: '📋 Next Steps', value: 'Check out the rules and introduce yourself!' }
            )
            .setTimestamp();
            
          await member.send({ embeds: [dmEmbed] });
          console.log(`   ✅ DM welcome sent to ${member.user.tag}`);
        } catch (error) {
          console.log(`   ⚠️ Could not DM ${member.user.tag} (DMs disabled)`);
        }
      }
      
      // 4. Log to log channel if configured
      if (config.channels.log) {
        const logChannel = member.guild.channels.cache.get(config.channels.log) as TextChannel;
        if (logChannel) {
          const logEmbed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('📥 Member Joined')
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
              { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
              { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
              { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true }
            )
            .setTimestamp();
            
          await logChannel.send({ embeds: [logEmbed] });
        }
      }
      
    } catch (error) {
      console.error(`❌ Error handling member join for ${member.user.tag}:`, error);
    }
  });
}