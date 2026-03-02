# AI Task Manager Bot for Discord

🤖 **AI-powered task management for Discord communities and teams**

Transform your Discord server into a productivity powerhouse with intelligent task tracking, AI prioritization, and team collaboration features.

## ✨ Features

### 📝 Task Management
- Create, assign, and track tasks
- Set priorities, due dates, and categories
- Task status tracking (Todo, In Progress, Done)
- Comments and updates on tasks

### 🤖 AI Integration (Premium)
- AI-powered task prioritization
- Smart due date suggestions
- Task breakdown into subtasks
- Natural language task creation

### 👥 Team Collaboration
- User mentions and assignments
- Team workload dashboard
- Task notifications and reminders
- Activity history

### 📊 Analytics
- Task completion rates
- Team productivity metrics
- Overdue task tracking
- Weekly summary reports

## 🚀 Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `/task create` | Create a new task | Everyone |
| `/task list` | View all tasks | Everyone |
| `/task assign` | Assign task to user | Everyone |
| `/task complete` | Mark task as done | Everyone |
| `/task delete` | Delete a task | Task Owner/Admin |
| `/ai prioritize` | AI prioritizes your tasks | Premium |
| `/team dashboard` | View team workload | Admin |
| `/stats` | Productivity analytics | Admin |
| `/help` | Show all commands | Everyone |

## 💰 Pricing

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 50 tasks, basic tracking, 7-day history |
| **Pro** | $29/mo | Unlimited tasks, AI features, full history |
| **Team** | $79/mo | Everything + team dashboards, priority support |

## 🛠️ Setup

1. Copy `.env.example` to `.env` and fill in your tokens
2. Run `npm install`
3. Run `npm run deploy-commands`
4. Run `npm run build && npm start`

## 🐳 Docker

```bash
docker-compose up -d
```

## 📄 License

MIT © QuantBitRealm
