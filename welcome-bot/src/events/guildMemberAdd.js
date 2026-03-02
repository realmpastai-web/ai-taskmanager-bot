const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    try {
      console.log(`👋 New member joined: ${member.user.tag} in ${member.guild.name}`);

      // Get configuration from environment variables
      const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
      const autoRoleId = process.env.AUTO_ROLE_ID;
      const dmWelcomeEnabled = process.env.DM_WELCOME_ENABLED === 'true';

      // 1. Send welcome message to channel
      if (welcomeChannelId) {
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);
        if (welcomeChannel) {
          const welcomeEmbed = new EmbedBuilder()
            .setColor(0x00FF88)
            .setTitle('🎉 Welcome to the Server!')
            .setDescription(
              `Hey ${member.user}, welcome to **${member.guild.name}**!\n\n` +
              `We're glad to have you here. Enjoy your stay! 🚀`
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
              { name: '📊 Member Count', value: `${member.guild.memberCount}`, inline: true },
              { name: '🆔 User ID', value: `${member.id}`, inline: true },
              { name: '📅 Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `User #${member.guild.memberCount}` });

          await welcomeChannel.send({ embeds: [welcomeEmbed] });
          console.log(`   ✅ Welcome message sent to #${welcomeChannel.name}`);
        } else {
          console.log(`   ⚠️ Welcome channel not found: ${welcomeChannelId}`);
        }
      }

      // 2. Assign auto-role (if configured)
      if (autoRoleId) {
        try {
          const role = member.guild.roles.cache.get(autoRoleId);
          if (role) {
            await member.roles.add(role);
            console.log(`   ✅ Auto-role "${role.name}" assigned`);
          } else {
            console.log(`   ⚠️ Auto-role not found: ${autoRoleId}`);
          }
        } catch (roleError) {
          console.error(`   ❌ Failed to assign role:`, roleError.message);
        }
      }

      // 3. Send DM welcome (if enabled)
      if (dmWelcomeEnabled) {
        try {
          const dmMessage = process.env.DM_WELCOME_MESSAGE || 
            `Welcome to ${member.guild.name}! 🎉\n\n` +
            `Thanks for joining. If you have any questions, feel free to ask the staff team.`;

          await member.send(dmMessage);
          console.log(`   ✅ Welcome DM sent`);
        } catch (dmError) {
          console.log(`   ⚠️ Could not send DM (user has DMs disabled)`);
        }
      }

      console.log(`✨ Welcome process completed for ${member.user.tag}`);

    } catch (error) {
      console.error('❌ Error in guildMemberAdd event:', error);
    }
  }
};
