import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { db } from '../database/Database';
import { config } from '../config';

export const data = new SlashCommandBuilder()
  .setName('task')
  .setDescription('Manage tasks')
  .addSubcommand(subcommand =>
    subcommand
      .setName('create')
      .setDescription('Create a new task')
      .addStringOption(option =>
        option.setName('title').setDescription('Task title').setRequired(true)
      )
      .addStringOption(option =>
        option.setName('description').setDescription('Task description').setRequired(false)
      )
      .addStringOption(option =>
        option.setName('priority')
          .setDescription('Task priority')
          .addChoices(
            { name: 'Low', value: 'low' },
            { name: 'Medium', value: 'medium' },
            { name: 'High', value: 'high' }
          )
      )
      .addStringOption(option =>
        option.setName('due_date').setDescription('Due date (YYYY-MM-DD)').setRequired(false)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('list')
      .setDescription('List all tasks')
      .addStringOption(option =>
        option.setName('status')
          .setDescription('Filter by status')
          .addChoices(
            { name: 'Todo', value: 'todo' },
            { name: 'In Progress', value: 'in_progress' },
            { name: 'Done', value: 'done' }
          )
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('complete')
      .setDescription('Mark a task as complete')
      .addIntegerOption(option =>
        option.setName('id').setDescription('Task ID').setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('assign')
      .setDescription('Assign task to a user')
      .addIntegerOption(option =>
        option.setName('id').setDescription('Task ID').setRequired(true)
      )
      .addUserOption(option =>
        option.setName('user').setDescription('User to assign').setRequired(true)
      )
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('delete')
      .setDescription('Delete a task')
      .addIntegerOption(option =>
        option.setName('id').setDescription('Task ID').setRequired(true)
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'create') {
    await handleCreate(interaction);
  } else if (subcommand === 'list') {
    await handleList(interaction);
  } else if (subcommand === 'complete') {
    await handleComplete(interaction);
  } else if (subcommand === 'assign') {
    await handleAssign(interaction);
  } else if (subcommand === 'delete') {
    await handleDelete(interaction);
  }
}

async function handleCreate(interaction: ChatInputCommandInteraction) {
  const title = interaction.options.getString('title', true);
  const description = interaction.options.getString('description') || '';
  const priority = (interaction.options.getString('priority') as any) || 'medium';
  const dueDateStr = interaction.options.getString('due_date');

  // Check free tier limit
  const taskCount = await db.getTaskCount(interaction.guildId!, interaction.user.id);
  if (taskCount >= config.maxFreeTasks) {
    return interaction.reply({
      content: `❌ You've reached the free tier limit (${config.maxFreeTasks} tasks). Upgrade to Pro for unlimited tasks!`,
      ephemeral: true
    });
  }

  let dueDate: Date | null = null;
  if (dueDateStr) {
    dueDate = new Date(dueDateStr);
    if (isNaN(dueDate.getTime())) {
      return interaction.reply({ content: '❌ Invalid date format. Use YYYY-MM-DD', ephemeral: true });
    }
  }

  const taskId = await db.createTask({
    guildId: interaction.guildId!,
    userId: interaction.user.id,
    title,
    description,
    status: 'todo',
    priority,
    dueDate,
    assignedTo: null
  });

  const embed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('✅ Task Created')
    .addFields(
      { name: 'ID', value: `#${taskId}`, inline: true },
      { name: 'Title', value: title, inline: true },
      { name: 'Priority', value: priority.toUpperCase(), inline: true }
    )
    .setFooter({ text: `Created by ${interaction.user.username}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function handleList(interaction: ChatInputCommandInteraction) {
  const status = interaction.options.getString('status') as any;
  const tasks = await db.getTasksByGuild(interaction.guildId!, status);

  if (tasks.length === 0) {
    return interaction.reply({ content: '📝 No tasks found!', ephemeral: true });
  }

  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`📋 Tasks (${tasks.length})`)
    .setDescription(
      tasks.slice(0, 10).map((t: any) => {
        const statusEmoji = t.status === 'done' ? '✅' : t.status === 'in_progress' ? '🔄' : '⏳';
        const priorityEmoji = t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢';
        return `${statusEmoji} #${t.id} ${priorityEmoji} **${t.title}**`;
      }).join('\n')
    );

  await interaction.reply({ embeds: [embed] });
}

async function handleComplete(interaction: ChatInputCommandInteraction) {
  const taskId = interaction.options.getInteger('id', true);
  await db.updateTaskStatus(taskId, 'done');
  await interaction.reply(`✅ Task #${taskId} marked as complete!`);
}

async function handleAssign(interaction: ChatInputCommandInteraction) {
  const taskId = interaction.options.getInteger('id', true);
  const user = interaction.options.getUser('user', true);
  await db.assignTask(taskId, user.id);
  await interaction.reply(`👤 Task #${taskId} assigned to ${user.username}`);
}

async function handleDelete(interaction: ChatInputCommandInteraction) {
  const taskId = interaction.options.getInteger('id', true);
  await db.deleteTask(taskId);
  await interaction.reply(`🗑️ Task #${taskId} deleted!`);
}