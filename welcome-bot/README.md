# Discord Welcome Bot

A professional Discord bot that automatically welcomes new members with customizable messages, auto-role assignment, and DM onboarding.

## Features

- 🎉 **Custom Welcome Messages** - Welcome users in a designated channel
- 🏷️ **Auto-Role Assignment** - Automatically assign roles to new members
- 📩 **DM Onboarding** - Send personalized welcome DMs with server info
- ⚙️ **Easy Configuration** - Simple environment-based setup
- 🐳 **Docker Ready** - One-command deployment with Docker
- 📝 **Slash Commands** - Modern Discord slash command interface

## Premium Features (Coming Soon)

- Custom welcome card images
- Advanced role assignment rules
- Welcome message analytics
- Multi-language support
- Custom embed designs

## Quick Start

### Prerequisites

- Node.js 18+ or Docker
- Discord Bot Token ([Get one here](https://discord.com/developers/applications))

### Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Discord bot token and configuration:
```env
DISCORD_TOKEN=your_bot_token_here
WELCOME_CHANNEL_ID=your_welcome_channel_id
AUTO_ROLE_ID=role_id_to_assign (optional)
ENABLE_DM_WELCOME=true
SERVER_NAME=Your Server Name
```

### Installation

#### Option 1: Docker (Recommended)

```bash
docker-compose up -d
```

#### Option 2: Local Node.js

```bash
npm install
npm run build
npm start
```

#### Option 3: Development Mode

```bash
npm install
npm run dev
```

## Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and enable these intents:
   - Server Members Intent (for welcome events)
   - Message Content Intent
4. Copy your bot token to `.env`
5. Go to "OAuth2" → "URL Generator":
   - Select `bot` scope
   - Select `Send Messages`, `Manage Roles`, `Read Message History` permissions
   - Copy the generated URL and invite the bot to your server

## Bot Invite Link Template

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot%20applications.commands
```

**Required Permissions:**
- `Send Messages` - To send welcome messages
- `Manage Roles` - To assign auto-roles (if enabled)
- `Read Message History` - To read commands

## Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `/ping` | Check bot latency | Everyone |
| `/help` | Show help information | Everyone |
| `/welcome test` | Test welcome message (sends to you) | Admin |
| `/welcome setchannel` | Set welcome channel | Admin |
| `/welcome setmessage` | Set custom welcome message | Admin |

## Project Structure

```
welcome-bot/
├── src/
│   ├── commands/          # Slash commands
│   │   ├── ping.ts
│   │   ├── help.ts
│   │   └── welcome.ts
│   ├── events/            # Event handlers
│   │   ├── ready.ts
│   │   ├── guildMemberAdd.ts
│   │   └── interactionCreate.ts
│   ├── services/          # Business logic
│   ├── utils/             # Helpers
│   ├── config.ts          # Configuration
│   └── index.ts           # Entry point
├── dist/                  # Compiled output
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### Bot not responding?
- Check that the bot token is correct
- Ensure the bot has proper permissions in the server
- Verify required intents are enabled in Developer Portal

### Welcome messages not sending?
- Check that `WELCOME_CHANNEL_ID` is correct
- Ensure bot has permission to send messages in that channel
- Check bot logs for errors

### Auto-role not working?
- Bot role must be higher than the auto-role in server hierarchy
- Verify `AUTO_ROLE_ID` is correct
- Check bot has "Manage Roles" permission

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or feature requests, please open an issue on GitHub.

---

Built with ❤️ by QuantBitRealm