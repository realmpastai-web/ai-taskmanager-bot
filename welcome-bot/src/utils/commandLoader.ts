import { Client } from 'discord.js';
import { Command } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export async function loadCommands(client: Client): Promise<void> {
  const commandsPath = path.join(__dirname, '..', 'commands');
  
  // Check if commands directory exists
  if (!fs.existsSync(commandsPath)) {
    console.log('ℹ️ No commands directory found');
    return;
  }
  
  const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  
  console.log(`📂 Loading ${commandFiles.length} commands...`);
  
  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const commandModule = await import(filePath);
      const command: Command = commandModule.default || commandModule;
      
      if (command.data && typeof command.execute === 'function') {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
      } else {
        console.warn(`⚠️ Command ${file} is missing data or execute property`);
      }
    } catch (error) {
      console.error(`❌ Failed to load command ${file}:`, error);
    }
  }
  
  console.log(`🎯 Loaded ${client.commands.size} commands successfully`);
}