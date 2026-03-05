# 🚀 Bot Deployment Checklist

**Date:** March 6, 2026  
**Agent:** discord-bot-worker  
**Status:** Ready for Live Deployment

---

## ✅ Pre-Deployment Status

All 5 premium bots are code-complete and ready for deployment:

| Bot | Status | ZIP Size | Railway Config | Health Check |
|-----|--------|----------|----------------|--------------|
| ServerStats Pro | ✅ Ready | 33KB | ✅ | ✅ |
| Ticket Support Bot | ✅ Ready | 24KB | ✅ | ✅ |
| Auto-Moderator Pro | ✅ Ready | 36KB | ✅ | ✅ |
| RealEstate Lead Bot | ✅ Ready | 35KB | ✅ | ✅ |
| Giveaway Pro Bot | ✅ Ready | 24KB | ✅ | ✅ |

---

## 🎯 Deployment Steps (Manual - Requires Browser)

### Step 1: Create Discord Applications

For each bot, visit https://discord.com/developers/applications:

1. Click "New Application"
2. Name it (e.g., "ServerStats Pro Demo")
3. Go to "Bot" → "Add Bot"
4. Copy the TOKEN (save securely)
5. Enable Intents:
   - ☑️ PRESENCE INTENT
   - ☑️ SERVER MEMBERS INTENT
   - ☑️ MESSAGE CONTENT INTENT
6. Go to "OAuth2" → "URL Generator"
   - Scopes: `bot`, `applications.commands`
   - Permissions: Administrator (or specific per bot)
7. Copy invite URL and invite to test server

### Step 2: Deploy to Railway

1. Visit https://railway.app and login with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `realmpastai-web/discord-bots`
4. Select the bot folder (e.g., `giveaway-pro-bot`)
5. Add Environment Variables:
   ```
   DISCORD_TOKEN=your_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   NODE_ENV=production
   ```
6. Click "Deploy"
7. Wait for health check to pass (`/health` endpoint)

### Step 3: Verify Deployment

Check the following:
- [ ] Bot shows as online in Discord
- [ ] `/help` command responds
- [ ] All slash commands register
- [ ] Health check URL returns 200 OK
- [ ] Logs show no errors

### Step 4: Create Screenshots

1. Run each command in test server
2. Take screenshots of:
   - Bot online status
   - Command responses
   - Embeds and UI
3. Save to `bots/screenshots/` folder

### Step 5: Update Sales Website

Add screenshots to `sales-website/index.html`:
- Hero section demo GIF
- Individual bot feature screenshots
- Command examples

---

## 🤖 Bot-Specific Deployment Notes

### Giveaway Pro Bot
- **Best for first deployment** (simplest, most visual)
- **Test commands:**
  - `/giveaway-create` - Create a test giveaway
  - `/giveaway-list` - View active giveaways
  - `/giveaway-stats` - View statistics
- **Duration format:** `30m`, `2h`, `1d`, `7d`

### ServerStats Pro
- **Requires:** Message content intent for tracking
- **Test commands:**
  - `/stats` - View server stats
  - `/activity` - See message activity chart
  - `/growth` - Member growth tracking
- **Note:** Stats populate over time as messages are sent

### Ticket Support Bot
- **Setup required:** `/ticket-setup` command first
- **Test commands:**
  - `/ticket-setup` - Create ticket panel
  - `/ticket-config` - Add categories
  - `/ticket` - Create a ticket
- **Requires:** Manage channels permission

### Auto-Moderator Pro
- **Setup required:** `/automod setup` command
- **Test commands:**
  - `/automod setup` - Initialize auto-mod
  - `/filters list` - View active filters
  - `/warn @user reason` - Test warning system
- **Note:** Test with alt account, not main!

### RealEstate Lead Bot
- **Setup required:** Configure lead channels
- **Test commands:**
  - `/property add` - Add a property
  - `/lead capture` - Test lead form
  - `/appointment schedule` - Test scheduling
- **Best for:** Real estate agent demo servers

---

## 📦 Gumroad Listing Steps

1. Visit https://gumroad.com and login
2. Click "Products" → "New Product"
3. For each bot:
   - Upload ZIP file
   - Copy title/description from `GUMROAD_LISTING.md`
   - Set price ($125-200)
   - Add tags: discord bot, discord.js, automation
   - Set to "Published"
4. Create bundle products:
   - Starter Bundle ($250)
   - Ultimate Bundle ($600)
   - Agency Bundle ($1,000)

---

## 🔧 Automation Scripts

### Quick Deploy Script (Run after Discord apps created)

```bash
#!/bin/bash
# deploy-bot.sh - Deploy a bot to Railway

BOT_NAME=$1
TOKEN=$2
CLIENT_ID=$3

if [ -z "$BOT_NAME" ] || [ -z "$TOKEN" ] || [ -z "$CLIENT_ID" ]; then
    echo "Usage: ./deploy-bot.sh <bot-folder> <token> <client_id>"
    exit 1
fi

cd /Users/quantzen/.openclaw/workspace-bot-builder/bots/$BOT_NAME

# Create .env file
cat > .env << ENVFILE
DISCORD_TOKEN=$TOKEN
DISCORD_CLIENT_ID=$CLIENT_ID
NODE_ENV=production
ENVFILE

echo "✅ $BOT_NAME ready for Railway deployment"
echo "Next steps:"
echo "1. Go to https://railway.app"
echo "2. Deploy from GitHub: realmpastai-web/discord-bots"
echo "3. Select folder: $BOT_NAME"
echo "4. Add env vars from .env file"
```

---

## 📊 Post-Deployment Verification

| Check | Giveaway | ServerStats | Ticket | Moderator | RealEstate |
|-------|----------|-------------|--------|-----------|------------|
| Bot Online | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| /help Works | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| All Commands | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Database OK | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Health Check | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Screenshots | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

---

## 🎯 Priority Order

1. **Giveaway Pro Bot** - Easiest to demo, visual appeal
2. **ServerStats Pro** - Popular use case, good analytics
3. **Ticket Support Bot** - High value for businesses
4. **Auto-Moderator Pro** - Important for large servers
5. **RealEstate Lead Bot** - Niche but high value

---

## 📞 Support

If deployment issues occur:
1. Check Railway logs for errors
2. Verify Discord token is valid
3. Ensure all intents are enabled
4. Check health check endpoint manually
5. Contact: quantbitrealm@gmail.com

---

**Next Action Required:** Create Discord applications for each bot (Step 1 above)

**Estimated Time:** 30 minutes for all 5 bots
**Revenue Impact:** $3,450-4,700/month potential once live
