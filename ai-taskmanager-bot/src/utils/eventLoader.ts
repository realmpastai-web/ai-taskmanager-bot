import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

export async function loadEvents(client: Client & { commands: Collection<string, any> }) {
  const eventsPath = join(__dirname, '../events');
  const eventFiles = readdirSync(eventsPath).filter(file => 
    file.endsWith('.js') || file.endsWith('.ts')
  );

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`✅ Loaded event: ${event.name}`);
  }
}