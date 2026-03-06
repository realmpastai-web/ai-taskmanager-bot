# AI Task Manager Bot - Railway Deployment Guide

## Quick Deploy (One-Click)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

## Manual Deployment

### 1. Prerequisites
- Railway account (free tier available)
- Discord bot token
- Discord application client ID

### 2. Create Discord Bot
1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name it "AI Task Manager"
4. Go to "Bot" → "Add Bot"
5. Copy the token (you'll need this)
6. Enable intents:
   - [x] SERVER MEMBERS INTENT
   - [x] MESSAGE CONTENT INTENT
7. Go to "OAuth2" → "URL Generator"
8. Select scopes: `bot`, `applications.commands`
9. Select permissions:
   - Send Messages
   - Read Messages/View Channels
   - Read Message History
   - Embed Links
   - Attach Files
   - Use Slash Commands
10. Copy the generated URL and invite the bot to your server

### 3. Deploy to Railway

#### Option A: GitHub Integration (Recommended)
1. Fork/clone this repository to your GitHub account
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   ```
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   OPENAI_API_KEY=your_openai_key_here (optional)
   ENABLE_AI=true (optional)
   ```
6. Click "Deploy"

#### Option B: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

### 4. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | ✅ | Your Discord bot token |
| `CLIENT_ID` | ✅ | Your Discord application client ID |
| `OPENAI_API_KEY` | ❌ | OpenAI API key for AI features |
| `ENABLE_AI` | ❌ | Set to `true` to enable AI features |
| `DATABASE_PATH` | ❌ | SQLite database path (default: `./data/tasks.db`) |
| `MAX_FREE_TASKS` | ❌ | Max tasks for free users (default: 50) |
| `PREMIUM_ROLE_ID` | ❌ | Discord role ID for premium users |

### 5. Health Check

The bot includes a health check endpoint at `/health`:
```bash
curl https://your-app.railway.app/health
```

Response:
```json
{
  "status": "ok",
  "uptime": 3600,
  "timestamp": "2026-03-06T08:30:00.000Z",
  "bot": {
    "tag": "AI Task Manager#1234",
    "id": "123456789",
    "status": "CONNECTED"
  },
  "wsPing": 45
}
```

### 6. Troubleshooting

**Bot shows as offline:**
- Check `DISCORD_TOKEN` is correct
- Verify bot is invited to your server
- Check Railway logs: `railway logs`

**Commands not appearing:**
- Run `npm run deploy-commands` locally with your credentials
- Or use the deploy-commands script in Railway

**Database errors:**
- Ensure `/app/data` directory exists (volume is mounted)
- Check file permissions

### 7. Support

For support, contact:
- Email: quantbitrealm@gmail.com
- Discord: @Santhosh

---

**Revenue Potential:** $29-79/month per subscriber
**Target Market:** Discord communities, teams, project managers
