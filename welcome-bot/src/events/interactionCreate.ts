import { Client, Events, ChatInputCommandInteraction } from 'discord.js';

export function execute(client: Client) {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    const command = client.commands.get(interaction.commandName);
    
    if (!command) {
      console.warn(`Command not found: ${interaction.commandName}`);
      return;
    }
    
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command ${interaction.commandName}:`, error);
      
      const reply = {
        content: '❌ There was an error executing this command!',
        ephemeral: true
      };
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  });
}