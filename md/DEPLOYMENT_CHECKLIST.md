# 🚀 Deployment Checklist

Complete this checklist before deploying to production.

## Frontend Deployment

### Pre-Deployment
- [ ] Update API URL in `script.js` (line 69-78) to production domain
- [ ] Test all forms with production API
- [ ] Verify all images load correctly
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Remove console.log statements (or set to production mode)
- [ ] Verify HTTPS works on frontend domain

### DNS Configuration
- [ ] Point `www.wargameshc.com` to hosting server
- [ ] Set up SSL certificate (Let's Encrypt recommended)
- [ ] Configure CDN (optional but recommended for images)

### Hosting Options
1. **Static Hosting (Recommended for Frontend)**
   - Netlify (Free tier available)
   - Vercel (Free tier available)
   - GitHub Pages
   - AWS S3 + CloudFront
   - Google Firebase Hosting

2. **Steps for Netlify/Vercel:**
   ```bash
   # 1. Install CLI
   npm install -g netlify-cli
   # or
   npm install -g vercel
   
   # 2. Deploy
   netlify deploy --prod
   # or
   vercel --prod
   ```

---

## Backend Deployment

### Pre-Deployment
- [ ] Install all security packages (see BACKEND_SECURITY_GUIDE.md)
- [ ] Create .env file with production values
- [ ] Update CORS_ORIGIN to production frontend URL
- [ ] Test API endpoints with Postman/Insomnia
- [ ] Set up database (if applicable)
- [ ] Configure email service (Gmail SMTP or SendGrid)
- [ ] Set up HTTPS certificate
- [ ] Configure firewall (allow only ports 80, 443, 22)

### Server Setup (VPS/Cloud)
- [ ] Choose hosting provider:
  - DigitalOcean (Recommended, $6/month)
  - AWS EC2
  - Google Cloud
  - Azure
  - Linode

- [ ] Server specifications:
  - Minimum: 1 CPU, 1GB RAM
  - OS: Ubuntu 22.04 LTS
  - Storage: 25GB SSD

### Installation Commands (Ubuntu)
```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2 (Process Manager)
sudo npm install -g pm2

# 4. Install Nginx
sudo apt install -y nginx

# 5. Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx

# 6. Clone your backend repository
cd /var/www
sudo git clone <your-backend-repo-url>
cd WargamesHolidayCentrePhuket-Backend

# 7. Install dependencies
npm install --production

# 8. Create .env file
sudo nano .env
# (paste your production environment variables)

# 9. Start with PM2
pm2 start server.js --name wargames-api
pm2 save
pm2 startup
```

### SSL Certificate Setup
```bash
# Get SSL certificate
sudo certbot --nginx -d api.wargameshc.com

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## Environment Variables

### Frontend (.env or config.js)
```
API_BASE_URL=https://api.wargameshc.com
```

### Backend (.env)
```
# Server
PORT=3000
NODE_ENV=production

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Security
CORS_ORIGIN=https://www.wargameshc.com
RATE_LIMIT_MAX_REQUESTS=100

# Contact
ADMIN_EMAIL=info@wargameshc.com
```

---

## Post-Deployment Testing

### Frontend
- [ ] Open https://www.wargameshc.com
- [ ] Test language switching (TH/EN)
- [ ] Test booking form submission
- [ ] Verify price calculations (THB/USD)
- [ ] Test on mobile devices
- [ ] Check Google PageSpeed Insights score

### Backend
- [ ] Test health check: `curl https://api.wargameshc.com/api/health`
- [ ] Test booking endpoint with valid data
- [ ] Test rate limiting (make 20+ requests quickly)
- [ ] Verify email delivery
- [ ] Check server logs: `pm2 logs wargames-api`

### Security Testing
- [ ] Run SSL test: https://www.ssllabs.com/ssltest/
- [ ] Check security headers: https://securityheaders.com/
- [ ] Test CORS: Try accessing API from different domain
- [ ] Verify rate limiting works
- [ ] Test input validation (send invalid data)

---

## Monitoring & Maintenance

### Set Up Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-server-monit

# Check server status
pm2 status
pm2 monit
```

### Regular Maintenance
- [ ] Set up automated backups
- [ ] Monitor server disk space
- [ ] Review logs weekly
- [ ] Update dependencies monthly: `npm audit fix`
- [ ] Renew SSL certificate (auto-renews every 90 days)

### Log Management
```bash
# View logs
pm2 logs wargames-api --lines 100

# Clear logs
pm2 flush

# Rotate logs
pm2 install pm2-logrotate
```

---

## Troubleshooting

### Backend not accessible
```bash
# Check if process is running
pm2 status

# Restart
pm2 restart wargames-api

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# Check firewall
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
```

### Email not sending
- Verify EMAIL_PASSWORD is app-specific password (not account password)
- Check Gmail "Less secure apps" settings
- Consider using SendGrid for production

### High CPU/Memory usage
```bash
# Check resource usage
pm2 monit

# Increase memory limit
pm2 start server.js --name wargames-api --max-memory-restart 500M
```

---

## Emergency Rollback

If something goes wrong:

```bash
# Frontend (Netlify/Vercel)
netlify rollback
# or
vercel rollback

# Backend
cd /var/www/WargamesHolidayCentrePhuket-Backend
git log --oneline  # Find last good commit
git checkout <commit-hash>
npm install
pm2 restart wargames-api
```

---

## Support Contacts

- **Technical Issues**: info@wargameshc.com
- **Phone**: +66 (0) 92-721-9803
- **Emergency**: (keep updated list of team contacts)

---

## Cost Estimate (Monthly)

### Minimal Setup
- Frontend: Netlify (Free)
- Backend: DigitalOcean Droplet ($6)
- Domain: Namecheap ($1/month)
- Email: Gmail (Free) or SendGrid ($15)
- **Total: ~$7-22/month**

### Production Setup
- Frontend: Netlify/Vercel ($0-19)
- Backend: DigitalOcean ($12-24)
- Database: PostgreSQL/MongoDB Atlas ($9)
- CDN: CloudFlare (Free)
- Monitoring: New Relic/DataDog (Free tier)
- Email: SendGrid ($15)
- **Total: ~$36-67/month**
