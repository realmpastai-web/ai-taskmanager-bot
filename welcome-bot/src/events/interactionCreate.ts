import { Interaction, ChatInputCommandInteraction } from 'discord.js';

export default {
  name: 'interactionCreate',
  once: false,
  async execute(interaction: Interaction) {
    // Only handle chat input command interactions
    if (!interaction.isChatInputCommand()) return;
    
    const commandInteraction = interaction as ChatInputCommandInteraction;
    const command = interaction.client.commands.get(commandInteraction.commandName);
    
    if (!command) {
      console.warn(`⚠️ Command not found: ${commandInteraction.commandName}`);
      return;
    }
    
    try {
      await command.execute(commandInteraction);
    } catch (error) {
      console.error(`❌ Error executing command ${commandInteraction.commandName}:`, error);
      
      const errorMessage = '❌ An error occurred while executing this command.';
      
      if (commandInteraction.replied || commandInteraction.deferred) {
        await commandInteraction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await commandInteraction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  },
};