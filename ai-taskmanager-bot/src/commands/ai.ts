import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import OpenAI from 'openai';
import { config } from '../config';
import { db } from '../database/Database';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

export const data = new SlashCommandBuilder()
  .setName('ai')
  .setDescription('AI-powered task features')
  .addSubcommand(subcommand =>
    subcommand
      .setName('prioritize')
      .setDescription('AI will prioritize your tasks')
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName('breakdown')
      .setDescription('AI breaks down a task into subtasks')
      .addStringOption(option =>
        option.setName('task').setDescription('Task to break down').setRequired(true)
      )
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!config.enableAI) {
    return interaction.reply({
      content: '❌ AI features are disabled. Add OPENAI_API_KEY to enable.',
      ephemeral: true
    });
  }

  await interaction.deferReply();

  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'prioritize') {
    await handlePrioritize(interaction);
  } else if (subcommand === 'breakdown') {
    await handleBreakdown(interaction);
  }
}

async function handlePrioritize(interaction: ChatInputCommandInteraction) {
  const tasks = await db.getTasksByUser(interaction.user.id, interaction.guildId!);
  
  if (tasks.length === 0) {
    return interaction.editReply('📝 You have no tasks to prioritize!');
  }

  const taskList = tasks.map(t => `- ${t.title} (Priority: ${t.priority}, Status: ${t.status})`).join('\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a task prioritization assistant. Analyze the tasks and provide a prioritized order with brief reasoning.'
      },
      {
        role: 'user',
        content: `Prioritize these tasks:\n${taskList}`
      }
    ]
  });

  const embed = new EmbedBuilder()
    .setColor(0x9B59B6)
    .setTitle('🤖 AI Task Prioritization')
    .setDescription(completion.choices[0].message.content || 'No response')
    .setFooter({ text: 'Powered by OpenAI' });

  await interaction.editReply({ embeds: [embed] });
}

async function handleBreakdown(interaction: ChatInputCommandInteraction) {
  const taskTitle = interaction.options.getString('task', true);

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a task planning assistant. Break down the given task into 3-5 actionable subtasks.'
      },
      {
        role: 'user',
        content: `Break down this task into subtasks: "${taskTitle}"`
      }
    ]
  });

  const embed = new EmbedBuilder()
    .setColor(0x3498DB)
    .setTitle(`📋 Subtasks for: ${taskTitle}`)
    .setDescription(completion.choices[0].message.content || 'No response')
    .setFooter({ text: 'Powered by OpenAI' });

  await interaction.editReply({ embeds: [embed] });
}