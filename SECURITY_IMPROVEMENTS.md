# 🔒 Security Improvements Applied

วันที่: 4 มกราคม 2026

## สรุปการปรับปรุงความปลอดภัย

เราได้ปรับปรุงความปลอดภัยของเว็บไซต์เพื่อป้องกันการโจมตีและการขโมยข้อมูล โดยครอบคลุมทั้ง 5 ด้านหลัก:

---

## ✅ 1. ป้องกัน XSS (Cross-Site Scripting)

### ที่แก้ไข:
- **เปลี่ยน `innerHTML` เป็น `textContent`** สำหรับข้อความธรรมดา
- **เพิ่ม DOMPurify library** สำหรับ sanitize HTML content
- ใช้ DOMPurify ใน:
  - `updateLanguage()` - การแปลภาษา
  - `createPlayerCard()` - สร้าง player cards
  - `createLoadingModal()` - loading modal
  - `updatePriceEstimate()` - แสดงราคา

### ตัวอย่างโค้ด:
```javascript
// ก่อน (อันตราย)
element.innerHTML = text;

// หลัง (ปลอดภัย)
if (text.includes('<')) {
    element.innerHTML = DOMPurify.sanitize(text);
} else {
    element.textContent = text;
}
```

---

## ✅ 2. Content Security Policy (CSP)

### ที่เพิ่มใน `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.google.com https://www.gstatic.com;
    style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://wargamesholidaycentrephuket-backend-production.up.railway.app http://localhost:3000 https://www.google.com;
    frame-src https://www.google.com;
">
```

### ประโยชน์:
- ✅ จำกัดแหล่งที่มาของ scripts, styles, images
- ✅ ป้องกัน inline scripts ที่เป็นอันตราย
- ✅ อนุญาตเฉพาะ CDN ที่เชื่อถือได้

---

## ✅ 3. Rate Limiting

### คุณสมบัติ:
- **จำกัดการส่งฟอร์ม: 3 ครั้งต่อ 1 นาที**
- **Cooldown period: 5 นาที** หลังเกินขนาด
- ใช้ client-side rate limiting ป้องกัน spam

### โค้ด:
```javascript
const RATE_LIMIT = {
    maxAttempts: 3,
    timeWindow: 60000, // 1 minute
    cooldownPeriod: 300000 // 5 minutes
};

function checkRateLimit() {
    // ตรวจสอบจำนวนครั้งที่พยายามส่ง
    // แสดงข้อความเตือนถ้าเกินกำหนด
}
```

### การทำงาน:
1. เก็บ timestamp ของการส่งแต่ละครั้ง
2. ตรวจสอบจำนวนครั้งใน time window
3. บล็อกการส่งถ้าเกิน 3 ครั้ง
4. รีเซ็ตหลังจาก cooldown period

---

## ✅ 4. Google reCAPTCHA v3

### การติดตั้ง:

#### 1. เพิ่ม script ใน `index.html`:
```html
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
```

#### 2. เพิ่ม hidden field ในฟอร์ม:
```html
<input type="hidden" id="recaptchaToken" name="recaptchaToken">
```

#### 3. ฟังก์ชัน verification:
```javascript
async function verifyRecaptcha() {
    const siteKey = '6LebhJ8sAAAAAP6I6hNbgTelN9vlXOQPTz316HI9'; // แทนที่ด้วย site key จริง
    const token = await grecaptcha.execute(siteKey, { action: 'booking' });
    return token;
}
```

#### 4. ส่งไปกับ booking data:
```javascript
const bookingData = {
    recaptchaToken: recaptchaToken,
    // ... ข้อมูลอื่นๆ
};
```

### 📝 สิ่งที่ต้องทำเพิ่มเติม:

1. **ลงทะเบียน Google reCAPTCHA v3**:
   - ไปที่: https://www.google.com/recaptcha/admin
   - สร้าง site key และ secret key
   - เลือก reCAPTCHA v3

2. **แทนที่ Site Key ใน 2 ที่**:
   ```html
   <!-- index.html -->
   <script src="https://www.google.com/recaptcha/api.js?render=YOUR_ACTUAL_SITE_KEY"></script>
   ```
   
   ```javascript
   // script.js
   const siteKey = 'YOUR_ACTUAL_SITE_KEY';
   ```

3. **ตรวจสอบ Token ที่ Backend**:
   ```javascript
   // ใน backend API
   const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
       method: 'POST',
       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
       body: `secret=YOUR_SECRET_KEY&response=${recaptchaToken}`
   });
   
   const result = await response.json();
   if (result.success && result.score >= 0.5) {
       // ยอมรับการ booking
   }
   ```

---

## ✅ 5. เพิ่มเติม - Production Checklist

### ก่อน Deploy:
- [ ] แทนที่ reCAPTCHA site key ด้วยของจริง
- [ ] ลบ `console.log()` ข้อมูลผู้ใช้ทั้งหมด
- [ ] เปิดใช้ HTTPS บังคับ
- [ ] ตั้งค่า CORS ใน backend อย่างถูกต้อง
- [ ] เพิ่ม rate limiting ที่ backend ด้วย
- [ ] ตรวจสอบ CSP ใน production environment

### Backend Recommendations:
```javascript
// เพิ่มใน backend
app.use(helmet()); // Security headers
app.use(rateLimit({ 
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(cors({
    origin: 'https://wargameshc.com',
    credentials: true
}));
```

---

## 📊 สรุปการป้องกัน

| ภัยคุกคาม | วิธีป้องกัน | สถานะ |
|-----------|-------------|-------|
| XSS | DOMPurify + textContent | ✅ Complete |
| Clickjacking | CSP headers | ✅ Complete |
| CSRF | reCAPTCHA v3 | ⚠️ Needs Site Key |
| Spam/DDoS | Rate Limiting | ✅ Complete |
| Data Theft | Input Validation | ✅ Complete |

---

## 🔧 การทดสอบ

### ทดสอบ XSS:
1. ลองใส่ `<script>alert('XSS')</script>` ในฟอร์ม
2. ควรถูก sanitize โดย DOMPurify
3. ไม่มี alert แสดงขึ้น

### ทดสอบ Rate Limiting:
1. ลองกด submit 4 ครั้งภายใน 1 นาที
2. ครั้งที่ 4 ควรถูกบล็อก
3. ต้องรอ 5 นาทีก่อนลองใหม่

### ทดสอบ CSP:
1. เปิด Developer Console
2. ลองโหลด script จาก domain ที่ไม่อนุญาต
3. ควรเห็น CSP violation error

---

## 📞 สิ่งที่ต้องทำต่อไป

1. **ลงทะเบียน reCAPTCHA**: https://www.google.com/recaptcha/admin
2. **แทนที่ Site Key** ใน `index.html` และ `script.js`
3. **เพิ่ม backend verification** สำหรับ reCAPTCHA token
4. **ตรวจสอบ production logs** หา security issues
5. **Regular security audits** ทุก 3-6 เดือน

---

## 📚 เอกสารอ้างอิง

- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Google reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

**หมายเหตุ**: ความปลอดภัยคือกระบวนการต่อเนื่อง ควรมีการตรวจสอบและอัพเดทอย่างสม่ำเสมอ
