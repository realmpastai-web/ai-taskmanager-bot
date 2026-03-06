import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from './config';
import { db } from './database/Database';
import { loadCommands } from './utils/commandLoader';
import { loadEvents } from './utils/eventLoader';
import './types';
import http from 'http';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
}) as Client & { commands: Collection<string, any> };

client.commands = new Collection();

// Health check server for Railway
const startHealthServer = () => {
  const port = process.env.PORT || 3000;
  
  const server = http.createServer((req, res) => {
    if (req.url === '/health') {
      const health = {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        bot: client.user ? {
          tag: client.user.tag,
          id: client.user.id,
          status: client.ws.status === 0 ? 'CONNECTED' : 'DISCONNECTED'
        } : null,
        wsPing: client.ws.ping
      };
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(health, null, 2));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  server.listen(port, () => {
    console.log(`✅ Health check server running on port ${port}`);
  });
  
  return server;
};

async function main() {
  console.log('🤖 Starting AI Task Manager Bot...');
  
  await db.init();
  await loadCommands(client);
  await loadEvents(client);

  // Start health check server
  startHealthServer();

  await client.login(config.discordToken);
  console.log(`✅ Bot logged in as ${client.user?.tag}`);
}

main().catch(console.error);

export { client };