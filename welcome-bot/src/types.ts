import { Client, ChatInputCommandInteraction, SlashCommandBuilder, Collection } from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

// Extend Client interface to include commands
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
  }
}