import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import { config } from './config';
import { loadEvents } from './utils/eventLoader';
import { loadCommands } from './utils/commandLoader';

// Create client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

// Store commands
client.commands = new Collection();

// Bot startup
async function start() {
  try {
    console.log('🚀 Starting Welcome Bot...');
    
    // Load commands
    await loadCommands(client);
    
    // Load events
    await loadEvents(client);
    
    // Login to Discord
    await client.login(config.discord.token);
    
    console.log('✅ Bot started successfully');
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

start();

// Type augmentation for commands collection
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
  }
}