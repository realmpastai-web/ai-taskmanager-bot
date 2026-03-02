import { Events, Client, ActivityType } from 'discord.js';

export const name = Events.ClientReady;
export const once = true;

export function execute(client: Client) {
  console.log(`🚀 Bot logged in as ${client.user?.tag}`);
  console.log(`📊 Serving ${client.guilds.cache.size} servers`);
  
  client.user?.setActivity('/help for commands', { type: ActivityType.Listening });
}