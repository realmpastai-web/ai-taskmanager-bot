import { Client, Events, ActivityType } from 'discord.js';
import { config } from '../config';

export function execute(client: Client) {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`✅ Logged in as ${readyClient.user.tag}`);
    console.log(`📊 Serving ${readyClient.guilds.cache.size} server(s)`);
    console.log(`👥 Total members: ${readyClient.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`);
    
    // Set bot status
    readyClient.user.setActivity(config.status, { type: ActivityType.Watching });
    
    console.log('\n🤖 Bot is ready to welcome members!\n');
  });
}