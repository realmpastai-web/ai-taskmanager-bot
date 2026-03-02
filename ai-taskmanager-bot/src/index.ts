import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from './config';
import { db } from './database/Database';
import { loadCommands } from './utils/commandLoader';
import { loadEvents } from './utils/eventLoader';
import './types';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
}) as Client & { commands: Collection<string, any> };

client.commands = new Collection();

async function main() {
  console.log('🤖 Starting AI Task Manager Bot...');
  
  await db.init();
  await loadCommands(client);
  await loadEvents(client);

  await client.login(config.discordToken);
}

main().catch(console.error);

export { client };