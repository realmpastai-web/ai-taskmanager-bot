import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from './config';
import { loadCommands } from './utils/commandLoader';
import { loadEvents } from './utils/eventLoader';

// Create Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

// Store commands in a collection
client.commands = new Collection();

// Initialize bot
async function main() {
  try {
    console.log('🚀 Starting Welcome Bot...');
    
    // Load commands and events
    await loadCommands(client);
    await loadEvents(client);
    
    // Login to Discord
    await client.login(config.discordToken);
    
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

main();