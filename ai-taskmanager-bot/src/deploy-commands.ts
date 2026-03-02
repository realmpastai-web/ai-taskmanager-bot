import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { config } from './config';
import { readdirSync } from 'fs';
import { join } from 'path';

const commands: SlashCommandBuilder[] = [];
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => 
  file.endsWith('.js') || file.endsWith('.ts')
);

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(config.discordToken);

(async () => {
  try {
    console.log(`🔄 Deploying ${commands.length} commands...`);

    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    );

    console.log('✅ Commands deployed successfully!');
  } catch (error) {
    console.error(error);
  }
})();