const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`🚀 Bot is online! Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} guild(s)`);
    
    // Set bot activity
    client.user.setActivity('/help | Welcoming members!', {
      type: ActivityType.Watching
    });

    // Log guild details
    client.guilds.cache.forEach(guild => {
      console.log(`   • ${guild.name} (${guild.id}) - ${guild.memberCount} members`);
    });
  }
};
