import { Client } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

export async function loadEvents(client: Client): Promise<void> {
  const eventsPath = path.join(__dirname, '..', 'events');
  
  // Check if events directory exists
  if (!fs.existsSync(eventsPath)) {
    console.log('ℹ️ No events directory found');
    return;
  }
  
  const eventFiles = fs.readdirSync(eventsPath)
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  
  console.log(`📂 Loading ${eventFiles.length} events...`);
  
  for (const file of eventFiles) {
    try {
      const filePath = path.join(eventsPath, file);
      const eventModule = await import(filePath);
      const event = eventModule.default || eventModule;
      
      if (event.name && typeof event.execute === 'function') {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`✅ Loaded event: ${event.name}`);
      } else {
        console.warn(`⚠️ Event ${file} is missing name or execute property`);
      }
    } catch (error) {
      console.error(`❌ Failed to load event ${file}:`, error);
    }
  }
  
  console.log(`🎯 Loaded ${eventFiles.length} events successfully`);
}