import { GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import { config } from '../config';

export async function sendWelcomeMessage(member: GuildMember): Promise<void> {
  try {
    const channel = member.guild.channels.cache.get(config.welcomeChannelId) as TextChannel;
    
    if (!channel) {
      console.error(`❌ Welcome channel ${config.welcomeChannelId} not found`);
      return;
    }
    
    const welcomeEmbed = new EmbedBuilder()
      .setColor(0x00ff88)
      .setTitle('🎉 Welcome!')
      .setDescription(
        config.customWelcomeMessage
          .replace('{user}', `<@${member.id}>`)
          .replace('{server}', config.serverName)
      )
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true },
        { name: 'Joined At', value: `<t:${Math.floor(member.joinedAt?.getTime()! / 1000)}:R>`, inline: true }
      )
      .setFooter({ text: `User ID: ${member.id}` })
      .setTimestamp();
    
    await channel.send({ embeds: [welcomeEmbed] });
    console.log(`✅ Welcome message sent for ${member.user.tag}`);
    
  } catch (error) {
    console.error(`❌ Failed to send welcome message:`, error);
  }
}

export async function assignAutoRole(member: GuildMember): Promise<void> {
  if (!config.autoRoleId) return;
  
  try {
    const role = member.guild.roles.cache.get(config.autoRoleId);
    
    if (!role) {
      console.error(`❌ Auto-role ${config.autoRoleId} not found`);
      return;
    }
    
    await member.roles.add(role);
    console.log(`✅ Assigned role ${role.name} to ${member.user.tag}`);
    
  } catch (error) {
    console.error(`❌ Failed to assign auto-role:`, error);
    console.log('💡 Make sure the bot role is higher than the auto-role in server settings');
  }
}

export async function sendDMWelcome(member: GuildMember): Promise<void> {
  if (!config.enableDMWelcome) return;
  
  try {
    const dmEmbed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`Welcome to ${config.serverName}!`)
      .setDescription(
        `Hey ${member.user.username}! 👋\n\n` +
        `Thanks for joining **${config.serverName}**! We're excited to have you here.\n\n` +
        `Be sure to:\n` +
        `• Read the server rules\n` +
        `• Introduce yourself\n` +
        `• Have fun! 🎉`
      )
      .setFooter({ text: 'This is an automated message' })
      .setTimestamp();
    
    await member.send({ embeds: [dmEmbed] });
    console.log(`✅ DM welcome sent to ${member.user.tag}`);
    
  } catch (error) {
    // User might have DMs disabled - this is fine
    console.log(`ℹ️ Could not send DM to ${member.user.tag} (likely DMs disabled)`);
  }
}