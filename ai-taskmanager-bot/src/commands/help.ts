import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show bot commands and information');

export async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x7289DA)
    .setTitle('🤖 AI Task Manager - Help')
    .setDescription('AI-powered task management for Discord teams')
    .addFields(
      {
        name: '📝 Task Commands',
        value: '`/task create` - Create a new task\n`/task list` - View all tasks\n`/task complete` - Mark task as done\n`/task assign` - Assign to user\n`/task delete` - Delete a task'
      },
      {
        name: '🤖 AI Features (Premium)',
        value: '`/ai prioritize` - AI prioritizes your tasks\n`/ai breakdown` - Break task into subtasks'
      },
      {
        name: '📊 Analytics',
        value: '`/stats` - View task statistics'
      }
    )
    .setFooter({ text: 'Built by QuantBitRealm | Free: 50 tasks | Pro: Unlimited' });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}