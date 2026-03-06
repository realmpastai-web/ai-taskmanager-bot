# 🚀 Quick Start Guide for Customers

## Deploy Your Bot in 5 Minutes

### Step 1: Get Your Discord Bot Token (2 minutes)

1. Go to https://discord.com/developers/applications
2. Click "New Application" → Name your bot
3. Go to "Bot" tab → Click "Add Bot"
4. Click "Copy" under TOKEN (save this!)
5. Enable these intents:
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
   - ✅ PRESENCE INTENT

### Step 2: Deploy to Railway (3 minutes)

**Option A: One-Click Deploy (Easiest)**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/quantbitrealm-discord-bots)

1. Click the button above
2. Connect your GitHub account
3. Paste your Discord token
4. Click "Deploy"
5. Done! Your bot is online.

**Option B: Manual Deploy**

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `realmpastai-web/discord-bots`
4. Add environment variables:
   - `DISCORD_TOKEN` = your token
   - `DISCORD_CLIENT_ID` = your client ID
5. Deploy!

### Step 3: Invite Bot to Your Server

1. In Discord Developer Portal, go to OAuth2 → URL Generator
2. Select scopes: `bot`, `applications.commands`
3. Select permissions (varies by bot - see README)
4. Copy the generated URL
5. Open in browser → Select your server → Authorize

### Step 4: Verify It's Working

Type `/help` in your Discord server. The bot should respond!

---

## Troubleshooting

### Bot shows "offline"
- Check Railway dashboard for errors
- Verify DISCORD_TOKEN is correct
- Check bot logs: `railway logs`

### Commands not appearing
- Wait 1-5 minutes (Discord caches commands)
- Re-invite bot with `applications.commands` scope
- Check bot has "Use Application Commands" permission

### Database errors
- SQLite database auto-creates on first run
- Ensure `/data` directory is writable
- For Railway: data persists automatically

---

## Need Help?

📧 Email: quantbitrealm@gmail.com  
⏰ Response time: Within 24 hours

---

## Next Steps

✅ Bot is deployed  
⏭️ Customize commands  
⏭️ Set up permissions  
⏭️ Train your moderators  

**Check the full README.md in your bot folder for advanced configuration.**
