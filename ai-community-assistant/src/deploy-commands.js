const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if (command.data) {
      commands.push(command.data.toJSON());
      console.log(`Prepared command: ${command.data.name}`);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
    if (process.env.GUILD_ID) {
      // Deploy to specific guild (development)
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands }
      );
      console.log(`Successfully deployed ${commands.length} commands to guild ${process.env.GUILD_ID}`);
    } else {
      // Deploy globally (production)
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log(`Successfully deployed ${commands.length} global commands`);
    }
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
})();
