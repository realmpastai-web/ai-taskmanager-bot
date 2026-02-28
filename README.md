# Discord Bots by QuantBitRealm

A collection of professional, production-ready Discord bots.

## 🚀 Available Bots

### Welcome Bot
A professional welcome bot with customizable messages, auto-roles, and logging.

**Features:**
- Auto-welcome new members
- Customizable welcome messages
- Auto-role assignment
- Join/leave logging
- Optional DM onboarding
- Docker ready

**Location:** `/welcome-bot/`

**Quick Start:**
```bash
cd welcome-bot
cp .env.example .env
# Edit .env with your Discord token
npm install
npm run build
npx ts-node src/deploy-commands.ts
npm start
```

## 📁 Repository Structure

```
discord-bots/
├── welcome-bot/      # Welcome Bot (v1.0.0)
│   ├── src/          # Source code
│   ├── Dockerfile    # Docker build
│   └── README.md     # Bot documentation
└── README.md         # This file
```

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Discord.js v14
- **Language:** TypeScript
- **Deployment:** Docker, Docker Compose

## 🔧 Common Setup

### Prerequisites

1. [Create a Discord Application](https://discord.com/developers/applications)
2. Copy your Bot Token and Client ID
3. Enable Privileged Intents (Server Members)

### Bot Permissions Required

- `Send Messages`
- `View Channels`
- `Manage Roles` (for auto-role)
- `Use Slash Commands`

## 📝 License

All bots are licensed under MIT. See individual bot READMEs for details.

---

Built with ❤️ by [QuantBitRealm](https://github.com/quantbitrealmSimon)

💼 Available for custom bot development - DM for inquiries!