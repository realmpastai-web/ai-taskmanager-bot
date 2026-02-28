import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('View bot commands and information');

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🤖 Welcome Bot')
    .setDescription('A professional welcome bot for your Discord server')
    .addFields(
      { 
        name: '📋 Commands', 
        value: [
          '`/ping` - Check bot latency',
          '`/help` - Show this message',
          '`/welcome` - Preview welcome message',
          '`/config` - View current configuration'
        ].join('\n') 
      },
      { 
        name: '✨ Features', 
        value: [
          '• Auto-welcome new members',
          '• Customizable welcome messages',
          '• Auto-role assignment',
          '• Join/leave logging',
          '• DM onboarding (optional)'
        ].join('\n') 
      },
      { 
        name: '💎 Premium', 
        value: 'Upgrade for embed welcomes, custom images, role selection, and more!' 
      }
    )
    .setFooter({ text: `Requested by ${interaction.user.tag}` })
    .setTimestamp();
    
  await interaction.reply({ embeds: [embed], ephemeral: true });
}