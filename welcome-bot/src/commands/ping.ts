import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check if the bot is online and view latency');

export async function execute(interaction: ChatInputCommandInteraction) {
  const sent = await interaction.reply({ 
    content: '🏓 Pinging...', 
    fetchReply: true,
    ephemeral: true 
  });
  
  const latency = sent.createdTimestamp - interaction.createdTimestamp;
  const apiLatency = Math.round(interaction.client.ws.ping);
  
  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('🏓 Pong!')
    .addFields(
      { name: 'Bot Latency', value: `${latency}ms`, inline: true },
      { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
    )
    .setTimestamp();
    
  await interaction.editReply({ content: '', embeds: [embed] });
}