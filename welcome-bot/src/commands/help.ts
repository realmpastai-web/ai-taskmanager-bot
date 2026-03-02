import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show bot commands and information'),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const helpEmbed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('🤖 Welcome Bot - Help')
      .setDescription('A professional Discord welcome bot with auto-role and DM onboarding.')
      .addFields(
        {
          name: '📋 Available Commands',
          value: 
            '`/ping` - Check bot latency\n' +
            '`/help` - Show this help message\n' +
            '`/welcome test` - Test welcome message (Admin only)'
        },
        {
          name: '✨ Features',
          value:
            '• Custom welcome messages\n' +
            '• Auto-role assignment\n' +
            '• DM onboarding\n' +
            '• Modern slash commands'
        },
        {
          name: '🆘 Support',
          value: 'Contact server admins for assistance.'
        }
      )
      .setFooter({ text: 'Welcome Bot v1.0.0' })
      .setTimestamp();
    
    await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  },
};

export default command;