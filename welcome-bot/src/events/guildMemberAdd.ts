import { GuildMember } from 'discord.js';
import { sendWelcomeMessage, assignAutoRole, sendDMWelcome } from '../services/welcomeService';

export default {
  name: 'guildMemberAdd',
  once: false,
  async execute(member: GuildMember) {
    console.log(`👋 New member joined: ${member.user.tag} (${member.id})`);
    
    try {
      // Send welcome message in designated channel
      await sendWelcomeMessage(member);
      
      // Assign auto-role if configured
      await assignAutoRole(member);
      
      // Send DM welcome if enabled
      await sendDMWelcome(member);
      
    } catch (error) {
      console.error(`❌ Error handling new member ${member.user.tag}:`, error);
    }
  },
};