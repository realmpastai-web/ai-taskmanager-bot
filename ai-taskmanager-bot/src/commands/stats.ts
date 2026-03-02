import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { db } from '../database/Database';

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('View task statistics and analytics');

export async function execute(interaction: ChatInputCommandInteraction) {
  const tasks = await db.getTasksByGuild(interaction.guildId!);
  
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const overdue = (await db.getOverdueTasks(interaction.guildId!)).length;

  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const embed = new EmbedBuilder()
    .setColor(0x1ABC9C)
    .setTitle('📊 Task Statistics')
    .addFields(
      { name: '📈 Completion Rate', value: `${completionRate}%`, inline: true },
      { name: '✅ Completed', value: `${done}`, inline: true },
      { name: '🔄 In Progress', value: `${inProgress}`, inline: true },
      { name: '⏳ Todo', value: `${todo}`, inline: true },
      { name: '⚠️ Overdue', value: `${overdue}`, inline: true },
      { name: '📝 Total', value: `${total}`, inline: true }
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}