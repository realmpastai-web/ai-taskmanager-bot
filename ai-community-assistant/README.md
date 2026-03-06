# AI Community Assistant Bot

An AI-powered Discord community assistant that answers questions, moderates discussions, and helps manage your server automatically.

## Features

### AI-Powered Chat
- 🤖 **Smart Q&A** - Answers community questions using AI
- 💡 **Knowledge Base** - Learns from your server docs and FAQs
- 🌐 **Multi-language Support** - Responds in user's language
- 📝 **Context Awareness** - Remembers conversation context

### Community Management
- 👋 **Auto-Welcome** - Welcomes new members with AI-generated messages
- 🏷️ **Smart Role Suggestions** - Suggests roles based on user activity
- 📊 **Engagement Analytics** - Tracks community health metrics
- 🔍 **Content Recommendations** - Suggests relevant channels/resources

### Moderation Assistant
- 🛡️ **Toxicity Detection** - AI-powered content moderation
- 📢 **Spam Detection** - Identifies and handles spam automatically
- 📝 **Conversation Summaries** - Summarizes long discussions
- ⚠️ **Escalation Alerts** - Alerts mods to potential issues

### Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `/ask` | Ask the AI assistant anything | Everyone |
| `/learn` | Add knowledge to the bot's database | Admin |
| `/welcome-config` | Configure AI welcome messages | Admin |
| `/moderation-config` | Configure AI moderation settings | Admin |
| `/community-stats` | View community engagement stats | Admin |
| `/summarize` | Summarize a channel's recent messages | Mod |
| `/translate` | Translate text to another language | Everyone |
| `/help` | Show all available commands | Everyone |

## Pricing

- **Personal License**: $199 (one server)
- **Commercial License**: $299 (multiple servers, resale rights)

## Tech Stack

- discord.js v14
- OpenAI GPT-4 API
- SQLite for knowledge base
- Winston logging
- Docker containerization

## Quick Start

1. Copy `.env.example` to `.env` and fill in your values
2. Run `npm install`
3. Run `npm run deploy` to register slash commands
4. Run `npm start` to start the bot

## Deployment

### Railway (Recommended)
1. Connect your GitHub repo to Railway
2. Add environment variables
3. Deploy automatically

### Docker
```bash
docker-compose up -d
```

## Support

For support, contact: support@quantbitrealm.dev

## License

MIT License
