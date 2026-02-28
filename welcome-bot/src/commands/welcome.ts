import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { config } from '../config';
import { formatWelcomeMessage } from '../utils/formatMessage';

export const data = new SlashCommandBuilder()
  .setName('welcome')
  .setDescription('Preview the welcome message (Admin only)')
  .setDefaultMemberPermissions(0x00000008); // Administrator permission

export async function execute(interaction: ChatInputCommandInteraction) {
  const memberCount = interaction.guild?.memberCount || 0;
  
  const welcomeText = formatWelcomeMessage(
    config.messages.welcome,
    interaction.user,
    interaction.guild?.name || 'Server',
    memberCount
  );
  
  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('👋 Welcome Preview')
    .setDescription('This is how new members will see the welcome message:')
    .addFields(
      { name: 'Message', value: welcomeText },
      { name: 'Channel', value: `<#${config.channels.welcome}>`, inline: true },
      { name: 'Auto-Role', value: config.roles.autoRole ? `<@&${config.roles.autoRole}>` : 'Disabled', inline: true }
    )
    .setThumbnail(interaction.user.displayAvatarURL())
    .setFooter({ text: 'Welcome Bot v1.0' })
    .setTimestamp();
    
  await interaction.reply({ embeds: [embed], ephemeral: true });
}