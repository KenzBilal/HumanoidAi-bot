# Deployment Guide - Humanoid Telegram Bot

This guide covers deploying the Humanoid bot to various platforms.

## Prerequisites

- Node.js 16+ installed locally
- Bot token from @BotFather
- Channel ID and Admin ID
- Git repository (recommended)

## Local Testing

Before deploying, test locally:

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

## Deployment Options

### 1. Vercel (Recommended for Beginners)

**Pros**: Free tier, easy setup, automatic deployments from Git

**Steps**:

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Add environment variables:
   - `TELEGRAM_BOT_TOKEN`
   - `CHANNEL_ID`
   - `ADMIN_ID`
   - `GITHUB_TOKEN` (optional)
5. Click "Deploy"

**Important**: Vercel has limitations for long-running processes. For production, consider Railway or self-hosted.

### 2. Railway (Recommended for Production)

**Pros**: Excellent for Node.js bots, generous free tier, easy scaling

**Steps**:

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway will detect Node.js automatically
5. Add environment variables in project settings
6. Deploy

**Railway Dashboard**:
- View logs in real-time
- Monitor resource usage
- Restart services easily
- Scale as needed

### 3. Heroku

**Pros**: Simple deployment, good documentation

**Steps**:

1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create humanoid-bot`
4. Set environment variables:
```bash
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set CHANNEL_ID=your_channel_id
heroku config:set ADMIN_ID=your_admin_id
```
5. Deploy: `git push heroku main`

**Note**: Heroku free tier was discontinued. Use paid dynos or alternative platforms.

### 4. DigitalOcean (VPS)

**Pros**: Full control, affordable, scalable

**Steps**:

1. Create Droplet (Ubuntu 22.04, $4-6/month)
2. SSH into droplet:
```bash
ssh root@your_droplet_ip
```

3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone repository:
```bash
git clone https://github.com/your-repo/humanoid-telegram-bot.git
cd humanoid-telegram-bot
npm install
```

5. Create `.env` file with credentials

6. Install PM2 for process management:
```bash
sudo npm install -g pm2
pm2 start bot.js --name "humanoid-bot"
pm2 startup
pm2 save
```

7. (Optional) Setup Nginx reverse proxy and SSL

### 5. AWS Lambda + API Gateway

**Pros**: Serverless, pay-per-use, scalable

**Steps**:

1. Create Lambda function (Node.js 18)
2. Upload code as ZIP
3. Set environment variables
4. Create API Gateway trigger
5. Update bot webhook to API Gateway URL

**Note**: Requires more setup than other options.

### 6. Self-Hosted (Raspberry Pi, Old PC)

**Pros**: Full control, no recurring costs

**Steps**:

1. Install Node.js
2. Clone repository
3. Create `.env` file
4. Use PM2 to keep bot running:
```bash
pm2 start bot.js
pm2 startup
pm2 save
```

5. (Optional) Setup dynamic DNS if IP changes

## Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `TELEGRAM_BOT_TOKEN` - From @BotFather
- [ ] `CHANNEL_ID` - Your Telegram channel ID
- [ ] `ADMIN_ID` - Your Telegram user ID
- [ ] `GITHUB_TOKEN` - (Optional) For release monitoring
- [ ] `NODE_ENV` - Set to "production"

## Monitoring & Maintenance

### Logs

**Railway/Vercel**: View in dashboard
**Self-hosted with PM2**:
```bash
pm2 logs humanoid-bot
```

### Restart Bot

**Railway/Vercel**: Redeploy or use dashboard restart
**Self-hosted with PM2**:
```bash
pm2 restart humanoid-bot
```

### Update Bot Code

**GitHub-connected platforms**: Push to main branch, auto-deploys
**Self-hosted**: 
```bash
git pull
npm install
pm2 restart humanoid-bot
```

## Troubleshooting

### Bot Not Responding

1. Check environment variables are set correctly
2. Verify bot token is valid
3. Check logs for errors
4. Ensure bot is added to channel

### Release Monitoring Not Working

1. Verify `GITHUB_TOKEN` is set
2. Check GitHub token has repo access
3. Verify repository path: `KenzBilal/HumanoidCodeLab`

### High Memory Usage

1. Check for memory leaks in logs
2. Restart bot
3. Consider upgrading to higher tier

## Cost Comparison

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| Vercel | ✅ Limited | $20+/mo | Beginners |
| Railway | ✅ $5/mo | $10+/mo | Production |
| Heroku | ❌ Discontinued | $7+/mo | Legacy projects |
| DigitalOcean | ❌ | $4+/mo | Full control |
| AWS Lambda | ✅ Limited | Pay-per-use | Scalability |
| Self-hosted | ✅ | Hardware cost | Maximum control |

## Recommended Setup

**For most users**: Railway
- Free tier: $5/month credit
- Easy to use
- Good performance
- Excellent support

**For beginners**: Vercel
- Simplest deployment
- Free tier available
- GitHub integration

**For advanced users**: Self-hosted or DigitalOcean
- Full control
- Better pricing at scale
- Custom configurations

## Next Steps

1. Choose a platform
2. Deploy the bot
3. Test all features
4. Monitor logs
5. Update knowledge base as needed
6. Gather user feedback

## Support

If you encounter issues:
- Check bot logs
- Verify environment variables
- Consult platform documentation
- Contact HumanoidCodeLab team

---

**Happy deploying! 🚀**
