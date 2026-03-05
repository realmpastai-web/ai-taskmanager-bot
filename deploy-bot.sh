#!/bin/bash
# Bot Deployment Helper Script
# Usage: ./deploy-bot.sh <bot-name> <discord-token> <client-id>

set -e

BOT_NAME=$1
DISCORD_TOKEN=$2
CLIENT_ID=$3

if [ -z "$BOT_NAME" ] || [ -z "$DISCORD_TOKEN" ] || [ -z "$CLIENT_ID" ]; then
    echo "❌ Usage: ./deploy-bot.sh <bot-folder> <discord-token> <client-id>"
    echo ""
    echo "Available bots:"
    ls -1 /Users/quantzen/.openclaw/workspace-bot-builder/bots/*/package.json 2>/dev/null | xargs -I{} dirname {} | xargs -I{} basename {}
    exit 1
fi

BOT_DIR="/Users/quantzen/.openclaw/workspace-bot-builder/bots/$BOT_NAME"

if [ ! -d "$BOT_DIR" ]; then
    echo "❌ Bot directory not found: $BOT_DIR"
    exit 1
fi

echo "🚀 Preparing $BOT_NAME for deployment..."

# Create .env file
cat > "$BOT_DIR/.env" << ENVFILE
# Discord Bot Configuration
DISCORD_TOKEN=$DISCORD_TOKEN
DISCORD_CLIENT_ID=$CLIENT_ID
NODE_ENV=production

# Optional settings
LOG_LEVEL=info
ENVFILE

echo "✅ Created .env file"

# Verify package.json exists
if [ ! -f "$BOT_DIR/package.json" ]; then
    echo "❌ package.json not found in $BOT_DIR"
    exit 1
fi

echo "✅ Verified package.json"

# Check for railway.json
if [ -f "$BOT_DIR/railway.json" ]; then
    echo "✅ Railway config found"
else
    echo "⚠️  railway.json not found - creating default..."
    cat > "$BOT_DIR/railway.json" << 'RAILWAY'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "node src/index.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
RAILWAY
fi

echo ""
echo "✅ $BOT_NAME is ready for Railway deployment!"
echo ""
echo "Next steps:"
echo "1. Visit https://railway.app"
echo "2. Login with GitHub"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select: realmpastai-web/discord-bots"
echo "5. Select root directory: bots/$BOT_NAME"
echo "6. Add environment variables from .env file"
echo "7. Click Deploy"
echo ""
echo "Bot location: $BOT_DIR"
echo "Env file: $BOT_DIR/.env"
