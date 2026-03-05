# Master Deployment Guide - QuantBitRealm Discord Bots

Universal deployment instructions for all QuantBitRealm Discord bots.

## 📋 Pre-Deployment Checklist

Before deploying any bot:
- [ ] Discord Developer Account created
- [ ] Bot application created at https://discord.com/developers/applications
- [ ] Required intents enabled (varies by bot)
- [ ] Bot invited to server with proper permissions
- [ ] Environment variables prepared

---

## Step 1: Create Discord Application

### 1.1 Create New Application
1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Name your bot (e.g., "ServerStats Pro", "Ticket Bot")
4. Click "Create"

### 1.2 Add Bot to Application
1. Go to "Bot" tab on the left
2. Click "Add Bot" → "Yes, do it!"
3. Under "TOKEN", click "Copy" (save this securely!)
4. Enable these intents (check the boxes):
   - ☑️ **PRESENCE INTENT** (if bot tracks user status)
   - ☑️ **SERVER MEMBERS INTENT** (if bot manages members/roles)
   - ☑️ **MESSAGE CONTENT INTENT** (if bot reads message content)

**Note:** Each bot has different intent requirements. Check the bot's README.md for specific requirements.

### 1.3 Get Client ID
1. Go to "OAuth2" → "General"
2. Copy "Client ID" (you'll need this for deployment)

### 1.4 Invite Bot to Server
1. Go to "OAuth2" → "URL Generator"
2. Under "SCOPES", select:
   - ☑️ `bot`
   - ☑️ `applications.commands`
3. Under "BOT PERMISSIONS", select based on bot type:

**For Analytics/Stats Bots:**
- View Channels
- Send Messages
- Read Message History

**For Moderation Bots:**
- Manage Roles
- Kick Members
- Ban Members
- Manage Messages
- Read Message History
- Moderate Members

**For Ticket/Support Bots:**
- Manage Channels
- Manage Roles
- Send Messages
- Read Message History

**For Giveaway Bots:**
- Manage Messages
- Add Reactions
- Read Message History

4. Copy the generated URL at the bottom
5. Open URL in browser
6. Select your server and click "Authorize"

---

## Step 2: Prepare Environment Variables

Create a `.env` file in the bot directory:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Required for ALL bots
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here

# Optional
NODE_ENV=production
PORT=3000
```

**Never commit `.env` to Git!** It's already in `.gitignore`.

---

## Step 3: Choose Deployment Method

### Option A: Railway (Recommended for Beginners)

**Pros:**
- Free tier available
- One-click deploy from GitHub
- Automatic HTTPS
- Easy environment variable management
- Built-in monitoring

**Cons:**
- Free tier has usage limits
- Requires GitHub account

**Steps:**
1. Push your bot code to GitHub
2. Go to https://railway.app and sign up
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Click "Add Variables" and add:
   - `DISCORD_TOKEN`
   - `DISCORD_CLIENT_ID`
   - `NODE_ENV=production`
6. Click "Deploy"
7. Railway will build and deploy automatically

**Deploy Slash Commands (One-time):**
```bash
# Run locally after Railway deployment
DISCORD_TOKEN=your_token DISCORD_CLIENT_ID=your_id node src/deploy-commands.js
```

---

### Option B: Docker (Recommended for Self-Hosting)

**Pros:**
- Consistent environment
- Easy to backup and migrate
- Works on any VPS
- No vendor lock-in

**Cons:**
- Requires Docker knowledge
- Need to manage server

**Steps:**

1. **Install Docker & Docker Compose**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# Or use official Docker repo for latest version
```

2. **Clone Repository**
```bash
git clone https://github.com/realmpastai-web/discord-bots.git
cd discord-bots/BOT_NAME
```

3. **Create Environment File**
```bash
cp .env.example .env
nano .env  # Add your tokens
```

4. **Start Bot**
```bash
docker-compose up -d
```

5. **Deploy Slash Commands (One-time)**
```bash
# Install Node.js locally first
npm install
npm run deploy
```

6. **View Logs**
```bash
docker-compose logs -f
```

7. **Stop Bot**
```bash
docker-compose down
```

---

### Option C: VPS with PM2 (Recommended for Production)

**Pros:**
- Full control
- Best performance
- Process monitoring
- Auto-restart on crash

**Cons:**
- Requires server management skills
- Need to handle SSL, backups, etc.

**Steps:**

1. **Provision VPS**
   - Recommended: 1GB RAM, 1 CPU minimum
   - Ubuntu 22.04 LTS recommended
   - Providers: DigitalOcean, Linode, Vultr, Hetzner

2. **SSH into Server**
```bash
ssh user@your-server-ip
```

3. **Install Node.js 18+**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Clone Repository**
```bash
git clone https://github.com/realmpastai-web/discord-bots.git
cd discord-bots/BOT_NAME
```

5. **Install Dependencies**
```bash
npm install
```

6. **Create Environment File**
```bash
cp .env.example .env
nano .env  # Add your tokens
```

7. **Deploy Slash Commands (One-time)**
```bash
npm run deploy
```

8. **Install PM2**
```bash
sudo npm install -g pm2
```

9. **Start Bot with PM2**
```bash
pm2 start src/index.js --name "bot-name"
```

10. **Save PM2 Config**
```bash
pm2 save
pm2 startup
```

11. **Monitor**
```bash
pm2 logs bot-name      # View logs
pm2 monit              # Interactive monitor
pm2 status             # Check status
```

**PM2 Commands:**
```bash
pm2 restart bot-name   # Restart
pm2 stop bot-name      # Stop
pm2 delete bot-name    # Remove
pm2 reload bot-name    # Zero-downtime reload
```

---

## Step 4: Verify Deployment

### Check Bot is Online
1. Look for bot in your Discord server member list
2. Bot should show as "Online"

### Test Commands
1. Type `/help` in your server
2. Bot should respond with help information
3. Test other commands based on bot type

### Check Logs
**Railway:**
- Go to Railway dashboard → Logs tab

**Docker:**
```bash
docker-compose logs -f
```

**PM2:**
```bash
pm2 logs bot-name
```

---

## Step 5: Post-Deployment Setup

Each bot requires specific setup after deployment:

### ServerStats Pro
- No additional setup required
- Start using `/stats`, `/activity`, etc.

### Ticket Support Bot
```
/ticket-setup        # Create ticket panel
/ticket-config       # Configure categories
/ticket-team         # Set support roles
```

### Auto-Moderator Pro
```
/automod logchannel  # Set mod log channel
/automod muterole    # Set mute role
/automod toggle      # Enable auto-mod
/filters             # Configure filters
```

### RealEstate Lead Bot
- No additional setup required
- Start adding leads with `/lead-add`

### Giveaway Pro Bot
- No additional setup required
- Create giveaways with `/giveaway-create`

---

## Troubleshooting

### Bot Shows Offline
- Check logs for errors
- Verify DISCORD_TOKEN is correct
- Ensure required intents are enabled

### Commands Not Working
- Deploy slash commands: `npm run deploy`
- Check bot has proper permissions in server
- Verify bot is in the server

### Database Errors
- Ensure `data/` directory exists and is writable
- For Docker: Check volume mounts
- For VPS: Check file permissions

### Railway Deployment Fails
- Verify all environment variables are set
- Check build logs in Railway dashboard
- Ensure Node.js version is 18+

### PM2 Bot Keeps Restarting
- Check logs: `pm2 logs bot-name`
- Common causes: Missing env vars, database permissions

---

## Security Best Practices

1. **Never commit `.env`** - It's in `.gitignore` by default
2. **Use environment variables** - Never hardcode tokens
3. **Regenerate token if leaked** - Discord Developer Portal → Bot → Regenerate
4. **Limit bot permissions** - Only request needed permissions
5. **Keep dependencies updated** - Run `npm audit` regularly

---

## Backup & Recovery

### Database Backup
**SQLite (all bots):**
```bash
# Backup
cp data/bot.db data/bot.db.backup.$(date +%Y%m%d)

# Restore
cp data/bot.db.backup.20240305 data/bot.db
```

**Docker:**
```bash
# Backup volume
docker cp bot-container:/app/data ./backup
```

### Code Backup
- Always keep code in GitHub
- Use branches for customizations
- Tag releases: `git tag -a v1.0.0 -m "Version 1.0.0"`

---

## Support

Need help with deployment?
- **Email:** quantbitrealm@gmail.com
- **GitHub:** github.com/realmpastai-web
- **Response Time:** Within 24 hours

---

**Ready to deploy your bot! 🚀**
