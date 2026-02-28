# Welcome Bot 🤖

A professional Discord welcome bot with customizable messages, auto-roles, and logging.

![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)
![Discord.js](https://img.shields.io/badge/discord.js-14.14-blue.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

## ✨ Features

- 🎉 **Auto-welcome new members** with customizable messages
- 📝 **Join/leave logging** to a dedicated channel
- 🏷️ **Auto-role assignment** for new members
- 📩 **Optional DM welcome** with server info
- 💬 **Slash commands** for admin management
- 🐳 **Docker ready** for easy deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Docker
- Discord Bot Token ([get one here](https://discord.com/developers/applications))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/quantbitrealmSimon/discord-bots.git
   cd discord-bots/welcome-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Deploy slash commands**
   ```bash
   npm run build
   npx ts-node src/deploy-commands.ts
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

## 🐳 Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up -d

# Or with Docker directly
docker build -t welcome-bot .
docker run -d --env-file .env --name welcome-bot welcome-bot
```

## ⚙️ Configuration

Edit `.env` with your settings:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
WELCOME_CHANNEL_ID=your_channel_id_here

# Optional settings
LOG_CHANNEL_ID=your_log_channel_id
AUTO_ROLE_ID=role_id_for_new_members
ENABLE_DM_WELCOME=true

# Message customization
WELCOME_MESSAGE=🎉 Welcome {user} to **{server}**! You are our **{count}th** member!
```

### Placeholders

- `{user}` - Mentions the new member
- `{username}` - The user's name
- `{server}` - Server name
- `{count}` - Current member count

## 📋 Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `/ping` | Check bot latency | Everyone |
| `/help` | View bot info | Everyone |
| `/welcome` | Preview welcome message | Administrator |
| `/config` | View bot configuration | Administrator |

## 🔗 Invite Link

Generate your bot invite link:

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435520&scope=bot%20applications.commands
```

**Required Permissions:**
- Send Messages
- View Channels
- Manage Roles (for auto-role)
- Use Slash Commands

## 📁 Project Structure

```
welcome-bot/
├── src/
│   ├── commands/        # Slash commands
│   ├── events/          # Event handlers (join/leave)
│   ├── utils/           # Helper functions
│   ├── config.ts        # Configuration loader
│   ├── deploy-commands.ts  # Register slash commands
│   └── index.ts         # Entry point
├── .env.example         # Environment template
├── docker-compose.yml   # Docker compose config
├── Dockerfile           # Docker build
└── package.json         # Dependencies
```

## 💎 Premium Features

Upgrade to premium for:
- Custom embed welcome messages
- Welcome images/banners
- Role selection on join
- Advanced analytics
- Priority support

Contact for premium access!

## 📝 License

MIT License - See [LICENSE](../LICENSE) for details.

---

Built with ❤️ by [QuantBitRealm](https://github.com/quantbitrealmSimon)