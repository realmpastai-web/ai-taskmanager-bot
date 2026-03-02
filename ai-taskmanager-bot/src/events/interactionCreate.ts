import { Events, ChatInputCommandInteraction } from 'discord.js';

export const name = Events.InteractionCreate;

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`Command ${interaction.commandName} not found`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const content = '❌ An error occurred while executing this command!';
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content, ephemeral: true });
    } else {
      await interaction.reply({ content, ephemeral: true });
    }
  }
}