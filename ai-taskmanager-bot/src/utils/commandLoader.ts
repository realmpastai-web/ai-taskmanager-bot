import { Client, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

export async function loadCommands(client: Client & { commands: Collection<string, any> }) {
  const commandsPath = join(__dirname, '../commands');
  const commandFiles = readdirSync(commandsPath).filter(file => 
    file.endsWith('.js') || file.endsWith('.ts')
  );

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
      console.log(`⚠️ Command ${file} missing required properties`);
    }
  }
}