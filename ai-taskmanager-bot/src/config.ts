import dotenv from 'dotenv';
dotenv.config();

export const config = {
  discordToken: process.env.DISCORD_TOKEN || '',
  clientId: process.env.CLIENT_ID || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  databasePath: process.env.DATABASE_PATH || './data/tasks.db',
  enableAI: process.env.ENABLE_AI === 'true',
  maxFreeTasks: parseInt(process.env.MAX_FREE_TASKS || '50'),
  premiumRoleId: process.env.PREMIUM_ROLE_ID || '',
};

export default config;