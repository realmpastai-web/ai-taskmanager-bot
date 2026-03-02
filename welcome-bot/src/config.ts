import dotenv from 'dotenv';

dotenv.config();

interface Config {
  discordToken: string;
  welcomeChannelId: string;
  autoRoleId: string | null;
  enableDMWelcome: boolean;
  serverName: string;
  customWelcomeMessage: string;
  botStatus: string;
}

function getEnvVar(key: string, required: boolean = false): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
}

export const config: Config = {
  discordToken: getEnvVar('DISCORD_TOKEN', true),
  welcomeChannelId: getEnvVar('WELCOME_CHANNEL_ID', true),
  autoRoleId: getEnvVar('AUTO_ROLE_ID') || null,
  enableDMWelcome: getEnvVar('ENABLE_DM_WELCOME', false).toLowerCase() === 'true',
  serverName: getEnvVar('SERVER_NAME', false) || 'our server',
  customWelcomeMessage: getEnvVar('CUSTOM_WELCOME_MESSAGE', false) || 
    'Hey {user}! Welcome to {server}! 🎉 We\'re glad to have you here.',
  botStatus: getEnvVar('BOT_STATUS', false) || 'Watching over new members',
};