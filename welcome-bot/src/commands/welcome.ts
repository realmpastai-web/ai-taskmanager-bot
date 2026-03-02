import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits,
  GuildMember 
} from 'discord.js';
import { Command } from '../types';
import { sendWelcomeMessage, sendDMWelcome, assignAutoRole } from '../services/welcomeService';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Welcome bot management commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('test')
        .setDescription('Test the welcome message (sends to you)')
    ) as SlashCommandBuilder,
  
  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'test') {
      await interaction.reply({ content: 'Testing welcome system...', ephemeral: true });
      
      try {
        // Simulate welcome for the command user
        const member = interaction.member as GuildMember;
        
        await sendWelcomeMessage(member);
        await assignAutoRole(member);
        await sendDMWelcome(member);
        
        await interaction.followUp({ 
          content: '✅ Welcome test completed! Check the welcome channel and your DMs.', 
          ephemeral: true 
        });
      } catch (error) {
        console.error('Test welcome error:', error);
        await interaction.followUp({ 
          content: '❌ Test failed. Check console for details.', 
          ephemeral: true 
        });
      }
    }
  },
};

export default command;