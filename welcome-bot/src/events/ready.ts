import { Client, ActivityType } from 'discord.js';
import { config } from '../config';

export default {
  name: 'ready',
  once: true,
  async execute(client: Client) {
    console.log(`✅ Bot logged in as ${client.user?.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} guild(s)`);
    
    // Set bot activity
    client.user?.setActivity(config.botStatus, { type: ActivityType.Watching });
    
    // Log startup info
    console.log('\n📋 Bot Configuration:');
    console.log(`   Welcome Channel: ${config.welcomeChannelId}`);
    console.log(`   Auto-Role: ${config.autoRoleId || 'Disabled'}`);
    console.log(`   DM Welcome: ${config.enableDMWelcome ? 'Enabled' : 'Disabled'}`);
    console.log(`   Server Name: ${config.serverName}`);
    console.log('\n🚀 Bot is ready and listening for events!\n');
    
    // Register slash commands globally
    try {
      if (client.application) {
        await client.application.commands.set(
          Array.from(client.commands.values()).map(cmd => cmd.data.toJSON())
        );
        console.log(`📝 Registered ${client.commands.size} slash commands globally`);
      }
    } catch (error) {
      console.error('❌ Failed to register slash commands:', error);
    }
  },
};