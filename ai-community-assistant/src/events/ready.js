const logger = require('../utils/logger');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
  name: 'ready',
  once: true,

  async execute(client) {
    logger.info(`Bot logged in as ${client.user.tag}`);
    
    // Set bot activity
    const activity = process.env.BOT_ACTIVITY || 'Helping communities';
    client.user.setActivity(activity, { type: 'WATCHING' });
    
    // Log guild count
    const guildCount = client.guilds.cache.size;
    logger.info(`Bot is in ${guildCount} guild(s)`);
    
    // Log startup complete
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     🤖 AI Community Assistant Bot - Online!            ║');
    console.log(`║     Logged in as: ${client.user.tag.padEnd(34)} ║`);
    console.log(`║     Guilds: ${guildCount.toString().padEnd(40)} ║`);
    console.log('╚════════════════════════════════════════════════════════╝');
  },
};
