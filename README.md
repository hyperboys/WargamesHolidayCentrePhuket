# 🎮 Wargames Holiday Centre Phuket

Official website for Wargames Holiday Centre Phuket - Thailand's premier wargaming destination.

## 🌟 Features

- **Bilingual Support**: Full Thai/English translation
- **Event Booking System**: Complete booking flow with validation
- **Price Calculator**: Dynamic pricing for players and companions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Contact Form**: Direct communication with the centre

## 🔧 Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Flatpickr for date selection
- Google Fonts (Roboto, Sarabun)

### Backend (Separate Repository)
- Node.js + Express
- Nodemailer for email notifications
- Security middleware (Helmet, CORS, Rate Limiting)

## 🚀 Quick Start

### Development

1. Clone the repository:
```bash
git clone <repository-url>
cd WargamesHolidayCentrePhuket
```

2. Open with Live Server:
   - Install VS Code extension: "Live Server"
   - Right-click `index.html` → "Open with Live Server"

3. Make sure backend is running:
```bash
cd ../WargamesHolidayCentrePhuket-Backend
npm install
npm run dev
```

### Production Deployment

See detailed instructions in:
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- [BACKEND_SECURITY_GUIDE.md](./BACKEND_SECURITY_GUIDE.md)

## 🔒 Security Features

### Implemented
✅ Dynamic API URL detection (dev/prod)
✅ Input sanitization on frontend
✅ Form validation
✅ HTTPS ready
✅ Environment configuration example

### Required for Backend
⚠️ See [BACKEND_SECURITY_GUIDE.md](./BACKEND_SECURITY_GUIDE.md) for:
- Rate limiting
- CORS policy
- Input validation
- Security headers (Helmet)
- HTTPS setup

## 📁 Project Structure

```
WargamesHolidayCentrePhuket/
├── index.html              # Main HTML file
├── script.js               # JavaScript logic
├── styles.css              # Styling
├── translations.js         # Language translations
├── config.example.js       # Configuration example
├── .gitignore             # Git ignore rules
├── BACKEND_SECURITY_GUIDE.md    # Security implementation
├── DEPLOYMENT_CHECKLIST.md      # Deployment guide
├── image/                  # Image assets
│   ├── logo.png
│   ├── about/
│   ├── event/
│   ├── gallery/
│   ├── gametype/
│   └── icon/
└── md/                     # Documentation
    └── *.md
```

## 🔑 Configuration

### Frontend

Update `script.js` line 69-78 with your production API URL:

```javascript
const API_BASE_URL = (() => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    }
    return 'https://api.wargameshc.com'; // Your production API
})();
```

### Backend

Create `.env` file (see BACKEND_SECURITY_GUIDE.md):

```env
PORT=3000
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CORS_ORIGIN=https://www.wargameshc.com
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Language switching (TH/EN)
- [ ] Event booking flow
- [ ] Price calculation (THB/USD)
- [ ] Form validation
- [ ] Mobile responsiveness
- [ ] Email delivery

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 📧 Contact Information

- **Website**: (to be deployed)
- **Email**: info@wargameshc.com
- **Phone**: +66 (0) 92-721-9803
- **Location**: Phuket, Thailand

## 📝 Development Notes

### Price Calculation
- **Players**: ฿7,000/night or $200/night
- **Adult Companions**: ฿3,500/night or $100/night
- **Exchange Rate**: 1 USD = 35 THB (approximate)
- Currency sent to API matches user's language selection

### Phone Number Format
- Country code dropdown (40+ countries)
- Separate input for phone number
- Sends combined format: "+66 81 234 5678"

### Auto-fill Feature
Personal Information auto-fills to Player 1 (when fields are empty)

## 🚧 Roadmap

- [ ] Payment gateway integration
- [ ] User accounts and booking history
- [ ] Real-time availability calendar
- [ ] Multi-language support (add more languages)
- [ ] Image optimization and lazy loading
- [ ] Progressive Web App (PWA) features
- [ ] Analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📄 License

This project is proprietary software for Wargames Holiday Centre Phuket.

## 🆘 Support

For technical support or deployment assistance:
- Email: info@wargameshc.com
- Phone: +66 (0) 92-721-9803

---

**Built with ❤️ for the wargaming community**
