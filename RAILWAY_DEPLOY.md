# 🚀 Railway Deployment Guide

One-click deploy templates for all QuantBitRealm Discord bots.

## Quick Deploy

### Giveaway Pro Bot
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

**Required Environment Variables:**
- `DISCORD_TOKEN` - Your Discord bot token
- `DISCORD_CLIENT_ID` - Your Discord application client ID

### ServerStats Pro
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

**Required Environment Variables:**
- `DISCORD_TOKEN` - Your Discord bot token
- `DISCORD_CLIENT_ID` - Your Discord application client ID

### Ticket Support Bot
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

**Required Environment Variables:**
- `DISCORD_TOKEN` - Your Discord bot token
- `DISCORD_CLIENT_ID` - Your Discord application client ID

### Auto-Moderator Pro
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

**Required Environment Variables:**
- `DISCORD_TOKEN` - Your Discord bot token
- `DISCORD_CLIENT_ID` - Your Discord application client ID

---

## Step-by-Step Deployment

### 1. Create Discord Bot Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name your bot
3. Go to "Bot" section and click "Add Bot"
4. Copy the token (you'll need this for Railway)
5. Enable intents:
   - ✅ PRESENCE INTENT
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
6. Go to "OAuth2" → "URL Generator"
7. Select scopes: `bot`, `applications.commands`
8. Select permissions based on your bot's needs
9. Copy the URL and invite the bot to your server

### 2. Deploy to Railway

**Option A: One-Click Deploy (Recommended)**

1. Click the "Deploy on Railway" button above
2. Connect your GitHub account
3. Select the repository
4. Add environment variables when prompted
5. Click "Deploy"

**Option B: CLI Deploy**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to your bot directory
cd giveaway-pro-bot  # or any bot folder

# Initialize Railway project
railway init

# Add environment variables
railway variables set DISCORD_TOKEN=your_token_here
railway variables set DISCORD_CLIENT_ID=your_client_id_here

# Deploy
railway up
```

### 3. Verify Deployment

1. Go to your Railway dashboard
2. Check the "Deployments" tab for successful build
3. Check logs for any errors
4. Test the bot in your Discord server

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | ✅ Yes | Bot token from Discord Developer Portal |
| `DISCORD_CLIENT_ID` | ✅ Yes | Application ID from Discord Developer Portal |
| `NODE_ENV` | Optional | Set to `production` for production builds |
| `PORT` | Optional | HTTP port for health checks (default: 3000) |

---

## Troubleshooting

### Bot shows as offline
- Check that `DISCORD_TOKEN` is correct
- Verify bot is invited to the server
- Check Railway logs for errors

### Commands not appearing
- Run the deploy-commands script:
  ```bash
  railway run node src/deploy-commands.js
  ```
- Wait up to 1 hour for global commands to propagate
- Or use guild-specific commands for instant updates

### Database errors
- SQLite is included and persists automatically on Railway
- No additional database setup required

### Health check failures
- All bots include a `/health` endpoint
- Railway uses this for monitoring
- Check that the bot starts without errors

---

## Support

Need help with deployment?

- 📧 Email: quantbitrealm@gmail.com
- 🐛 GitHub Issues: [realmpastai-web/ai-taskmanager-bot](https://github.com/realmpastai-web/ai-taskmanager-bot)

---

## Live Website

🌐 **Portfolio Website**: https://realmpastai-web.github.io/ai-taskmanager-bot/

View all available bots, pricing, and bundles on our live site.
