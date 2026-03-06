# AI Community Assistant Bot - Deployment Guide

## Quick Start (5 Minutes)

### 1. Prerequisites

- Node.js 18+ installed
- Discord account
- OpenAI account (for API key)

### 2. Discord Bot Setup

1. Go to https://discord.com/developers/applications
2. Click "New Application" → Name it "AI Community Assistant"
3. Go to "Bot" tab → Click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - ✅ PRESENCE INTENT
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
5. Click "Reset Token" → Copy the token (save it securely)
6. Go to "OAuth2" → "URL Generator"
7. Select scopes: `bot`, `applications.commands`
8. Select permissions:
   - Administrator (recommended for full functionality)
   - Or individually: Send Messages, Manage Messages, Read Message History, Ban Members, Kick Members
9. Copy the generated URL and open it in browser
10. Select your server and authorize

### 3. OpenAI Setup

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (you won't see it again!)
4. Add a payment method (required for API usage)
   - Typical usage: $0.01-0.03 per AI interaction
   - Set usage limits in billing settings

### 4. Bot Installation

```bash
# Clone or extract the bot
cd ai-community-assistant

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your tokens
nano .env  # or use any text editor
```

**Required .env values:**
```
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
OPENAI_API_KEY=your_openai_api_key
```

### 5. Deploy Commands

```bash
npm run deploy
```

This registers the slash commands with Discord. You should see "Successfully deployed 8 commands".

### 6. Start the Bot

```bash
npm start
```

You should see:
```
🤖 AI Community Assistant Bot - Online!
Logged in as: AI Community Assistant#1234
Guilds: 1
```

### 7. Test the Bot

In your Discord server, type:
```
/ask question: What can you do?
```

The bot should respond with an AI-generated answer!

---

## Deployment Options

### Option A: Local/Development

Just run `npm start` — perfect for testing.

### Option B: Railway (Recommended for Production)

1. Push code to GitHub
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables in Railway dashboard
6. Deploy automatically

**Benefits:**
- Free tier available
- Auto-restart on crashes
- Built-in health checks
- Easy scaling

### Option C: Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Option D: VPS with PM2

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start src/index.js --name "ai-assistant"

# Save PM2 config
pm2 save
pm2 startup

# Monitor
pm2 logs ai-assistant
pm2 monit
```

---

## Configuration

### Welcome Messages

```
/welcome-config channel:#welcome enabled:true use-ai:true
```

Options:
- `channel` - Where to send welcome messages
- `enabled` - Turn welcomes on/off
- `use-ai` - Use AI-generated messages (or set custom message)
- `custom-message` - Your own welcome template (use {user} for mention)

### Moderation

```
/moderation-config toxicity-detection:true spam-detection:true auto-delete-spam:false
```

Options:
- `toxicity-detection` - Monitor for toxic content
- `spam-detection` - Detect repetitive/spam messages
- `auto-delete-spam` - Automatically delete spam
- `log-channel` - Where to log moderation actions
- `toxicity-threshold` - Sensitivity (0.0-1.0, default 0.7)

### Knowledge Base

Teach the bot your server-specific info:

```
/learn keyword:"server rules" response:"1. Be respectful 2. No spam 3. Have fun!"
```

Now when someone asks about rules, the bot will respond with your answer!

---

## Troubleshooting

### "Invalid Token" Error
- Double-check your DISCORD_TOKEN in .env
- Make sure there are no extra spaces
- Regenerate token in Discord Developer Portal if needed

### "Application ID Required" Error
- Add CLIENT_ID to .env
- Find this in Discord Developer Portal → General Information → Application ID

### Commands Not Showing
- Run `npm run deploy` again
- Wait 1-5 minutes for Discord to sync
- Try kicking and re-inviting the bot

### AI Not Responding
- Check OPENAI_API_KEY is correct
- Verify you have billing set up on OpenAI
- Check logs for specific errors

### Database Errors
- Ensure the `data/` directory exists and is writable
- Check file permissions
- For Docker: ensure volume is mounted correctly

---

## Security Best Practices

1. **Never commit .env** - It's in .gitignore by default
2. **Rotate tokens regularly** - Reset Discord token monthly
3. **Set OpenAI usage limits** - Prevent unexpected bills
4. **Use specific permissions** - Don't give Administrator unless needed
5. **Monitor logs** - Check for suspicious activity

---

## Support

Need help? Contact us:
- 📧 Email: support@quantbitrealm.dev
- 💬 Discord: [Join our support server]

---

**Ready to deploy?** Follow the Quick Start above and you'll have your AI assistant running in 5 minutes!
