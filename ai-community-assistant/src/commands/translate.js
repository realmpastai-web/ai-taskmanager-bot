const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const OpenAI = require('openai');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const languageNames = {
  'en': 'English',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'hi': 'Hindi',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate text to another language')
    .addStringOption(option =>
      option
        .setName('text')
        .setDescription('Text to translate')
        .setRequired(true)
        .setMaxLength(1000)
    )
    .addStringOption(option =>
      option
        .setName('to')
        .setDescription('Target language')
        .setRequired(true)
        .addChoices(
          { name: 'English', value: 'en' },
          { name: 'Spanish', value: 'es' },
          { name: 'French', value: 'fr' },
          { name: 'German', value: 'de' },
          { name: 'Italian', value: 'it' },
          { name: 'Portuguese', value: 'pt' },
          { name: 'Russian', value: 'ru' },
          { name: 'Japanese', value: 'ja' },
          { name: 'Korean', value: 'ko' },
          { name: 'Chinese', value: 'zh' },
          { name: 'Arabic', value: 'ar' },
          { name: 'Hindi', value: 'hi' }
        )
    ),

  async execute(interaction, client) {
    const text = interaction.options.getString('text');
    const targetLang = interaction.options.getString('to');
    
    await interaction.deferReply();
    
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text to ${languageNames[targetLang]}. Only provide the translation, no explanations.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      });
      
      const translation = completion.choices[0].message.content;
      
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🌐 Translation')
        .addFields(
          { name: 'Original', value: text.substring(0, 500) },
          { name: `Translated (${languageNames[targetLang]})`, value: translation }
        )
        .setTimestamp();
      
      await interaction.editReply({ embeds: [embed] });
      
      logger.info(`${interaction.user.tag} translated text to ${languageNames[targetLang]}`);
      
    } catch (error) {
      logger.error('Error in translate command:', error);
      await interaction.editReply({
        content: '❌ Failed to translate text. Please try again.',
      });
    }
  },
};
