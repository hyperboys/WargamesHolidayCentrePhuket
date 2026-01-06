# Backend Security Implementation Guide

This guide helps you secure your backend before deployment.

## 🔐 Required Security Updates

### 1. Install Security Packages

```bash
npm install express-rate-limit helmet cors express-validator dotenv
```

### 2. Create .env File

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Security
CORS_ORIGIN=https://www.wargameshc.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Contact Info
ADMIN_EMAIL=admin@wargameshc.com
```

### 3. Update server.js (or index.js)

Add this code to your backend entry file:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// ===== SECURITY MIDDLEWARE =====

// 1. Helmet - Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// 2. CORS - Allow only your domain
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
};
app.use(cors(corsOptions));

// 3. Rate Limiting - Prevent DDoS
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply to all routes
app.use(limiter);

// Stricter rate limit for booking endpoint
const bookingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 bookings per hour per IP
    message: 'Too many booking requests, please try again later.',
});

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== VALIDATION MIDDLEWARE =====

const bookingValidation = [
    body('firstName').trim().isLength({ min: 1, max: 100 }).escape(),
    body('lastName').trim().isLength({ min: 1, max: 100 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('phone').trim().isLength({ min: 5, max: 50 }).escape(),
    body('phoneCountryCode').trim().isLength({ min: 2, max: 10 }).escape(),
    body('phoneNumber').trim().isLength({ min: 5, max: 30 }).escape(),
    body('country').trim().isLength({ min: 2, max: 100 }).escape(),
    body('selectedEvent').trim().escape(),
    body('packageType').trim().isIn(['day-visit', 'weekend-warrior', 'campaign-weekend', 'extended-campaign', 'custom']),
    body('checkIn').isISO8601().toDate(),
    body('checkOut').isISO8601().toDate(),
    body('nights').isInt({ min: 1, max: 30 }),
    body('adults').isInt({ min: 0, max: 50 }),
    body('children').isInt({ min: 0, max: 50 }),
    body('playerCount').isInt({ min: 1, max: 50 }),
    body('accommodation').trim().isIn(['basic', 'standard', 'premium']),
    body('specialRequests').optional().trim().isLength({ max: 1000 }).escape(),
    body('hearAbout').optional().trim().isLength({ max: 200 }).escape(),
    body('players').isArray({ min: 1, max: 50 }),
    body('players.*.firstName').trim().isLength({ min: 1, max: 100 }).escape(),
    body('players.*.lastName').trim().isLength({ min: 1, max: 100 }).escape(),
    body('players.*.age').isInt({ min: 1, max: 120 }),
    body('priceEstimate.currency').isIn(['THB', 'USD']),
    body('priceEstimate.total').isNumeric(),
];

// ===== ROUTES =====

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV 
    });
});

// Booking endpoint with validation and rate limiting
app.post('/api/booking', bookingLimiter, bookingValidation, async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const bookingData = req.body;
        
        // Additional business logic validation
        if (new Date(bookingData.checkOut) <= new Date(bookingData.checkIn)) {
            return res.status(400).json({
                success: false,
                message: 'Check-out date must be after check-in date'
            });
        }

        // TODO: Add your email sending logic here
        // await sendBookingEmail(bookingData);

        res.json({ 
            success: true, 
            message: 'Booking received successfully' 
        });
        
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!' 
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'localhost'}`);
});
```

### 4. HTTPS Setup (Production)

#### Option A: Using Let's Encrypt (Free)

1. Install Certbot:
```bash
sudo apt-get update
sudo apt-get install certbot
```

2. Get certificate:
```bash
sudo certbot certonly --standalone -d api.wargameshc.com
```

3. Update your server to use HTTPS:
```javascript
const https = require('https');
const fs = require('fs');

const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.wargameshc.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.wargameshc.com/fullchain.pem')
};

https.createServer(httpsOptions, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
});
```

#### Option B: Using Nginx as Reverse Proxy

1. Install Nginx:
```bash
sudo apt-get install nginx
```

2. Configure Nginx (`/etc/nginx/sites-available/api.wargameshc.com`):
```nginx
server {
    listen 80;
    server_name api.wargameshc.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.wargameshc.com;

    ssl_certificate /etc/letsencrypt/live/api.wargameshc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.wargameshc.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/api.wargameshc.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Environment-specific package.json scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "NODE_ENV=development nodemon server.js",
    "prod": "NODE_ENV=production node server.js"
  }
}
```

## 🔍 Security Checklist Before Deploy

- [ ] All environment variables moved to .env file
- [ ] .env file added to .gitignore
- [ ] HTTPS certificate installed
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Helmet security headers enabled
- [ ] Error messages don't expose sensitive info
- [ ] Database credentials secured (if applicable)
- [ ] Email credentials using app passwords (not real password)
- [ ] Server firewall configured (only ports 80, 443, 22 open)
- [ ] Regular security updates scheduled
- [ ] Monitoring and logging set up
- [ ] Backup strategy in place

## 📞 Emergency Contacts

If you need help with deployment:
- Technical support: info@wargameshc.com
- Phone: +66 (0) 92-721-9803

## 🔗 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
