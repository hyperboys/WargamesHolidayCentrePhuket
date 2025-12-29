# API Integration Guide

## Frontend-Backend Connection

Frontend ได้เชื่อมต่อกับ Backend API แล้ว ✅

### การตั้งค่า

#### 1. ตั้งค่า Backend URL

ในไฟล์ `script.js` มีการกำหนด API URL:

```javascript
// Backend API Configuration
const API_BASE_URL = 'http://localhost:3000'; // Development
// const API_BASE_URL = 'https://your-backend.railway.app'; // Production
```

**สำหรับ Development (Local):**
- ใช้ `http://localhost:3000`
- Backend ต้องรันอยู่ที่ port 3000

**สำหรับ Production:**
- เปลี่ยนเป็น URL ที่ deploy จริง เช่น:
  - Railway: `https://your-app.railway.app`
  - Render: `https://your-app.onrender.com`

#### 2. เริ่มใช้งาน

**ขั้นตอนที่ 1: เริ่ม Backend Server**
```bash
cd d:\repos\WargamesHolidayCentrePhuket-Backend
npm run dev
```

ตรวจสอบว่า server รันสำเร็จ:
- ✅ ไปที่ http://localhost:3000/api/health
- ควรเห็น: `{"status":"OK","message":"..."}`

**ขั้นตอนที่ 2: เปิด Frontend**
```bash
cd d:\repos\WargamesHolidayCentrePhuket

# ถ้ามี Live Server extension ใน VS Code
# คลิกขวาที่ index.html -> Open with Live Server

# หรือใช้ python
python -m http.server 5500

# หรือใช้ Node.js http-server
npx http-server -p 5500
```

เปิดเบราว์เซอร์ไปที่: http://localhost:5500

**ขั้นตอนที่ 3: ทดสอบการจอง**
1. กดปุ่ม "Book Now" หรือ "จองเลย"
2. กรอกข้อมูลในฟอร์ม
3. กด "Send Booking Request"
4. ดู Console (F12) เพื่อดูสถานะ:
   - `📤 Sending booking request:` - กำลังส่ง
   - `✅ Booking submitted successfully:` - สำเร็จ
   - `❌ Error submitting booking:` - มีข้อผิดพลาด

### การทำงานของระบบ

#### 1. เมื่อ Submit Form:
```javascript
// Frontend (script.js)
const response = await fetch(`${API_BASE_URL}/api/booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
});
```

#### 2. Backend รับข้อมูล:
```javascript
// Backend (routes/booking.js)
router.post('/', async (req, res) => {
    // ส่งอีเมลให้ admin
    await sendAdminNotification(bookingData);
    // ส่งอีเมลยืนยันให้ลูกค้า
    await sendCustomerConfirmation(bookingData);
    // ส่ง response กลับ
    res.json({ success: true, bookingId: ... });
});
```

#### 3. ลูกค้าได้รับ:
- ✉️ Email ยืนยันการจอง
- ✅ Success modal บนเว็บ

#### 4. Admin ได้รับ:
- ✉️ Email แจ้งเตือนการจองใหม่

### การแก้ปัญหา

#### ❌ CORS Error
```
Access to fetch at 'http://localhost:3000' from origin 'http://localhost:5500' 
has been blocked by CORS policy
```

**วิธีแก้:**
Backend มี CORS config แล้ว แต่ถ้ายังมีปัญหา:

```javascript
// Backend: server.js
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
}));
```

#### ❌ Connection Refused
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**วิธีแก้:**
1. ตรวจสอบว่า Backend รันอยู่:
   ```bash
   cd WargamesHolidayCentrePhuket-Backend
   npm run dev
   ```

2. ตรวจสอบ port ถูกต้อง (3000)

#### ❌ Email ไม่ส่ง
```
Email configuration error
```

**วิธีแก้:**
1. ตรวจสอบ `.env` ใน Backend:
   ```
   EMAIL_USER=info@wargameshc.com
   EMAIL_PASS=your_app_password_here
   ```

2. สร้าง App Password จาก Google:
   - https://myaccount.google.com/apppasswords

3. Restart backend server

### Production Deployment

#### 1. Deploy Backend (Railway/Render)
```bash
# Push to GitHub
cd WargamesHolidayCentrePhuket-Backend
git init
git add .
git commit -m "Initial backend"
git push
```

Deploy บน Railway/Render และได้ URL เช่น:
`https://wargames-backend.railway.app`

#### 2. Update Frontend API URL
```javascript
// script.js
const API_BASE_URL = 'https://wargames-backend.railway.app';
```

#### 3. Update Backend CORS
```javascript
// Backend: server.js
app.use(cors({
  origin: 'https://wargamesphuket.netlify.app', // Frontend URL จริง
  credentials: true
}));
```

หรือตั้งใน `.env`:
```
FRONTEND_URL=https://wargamesphuket.netlify.app
```

#### 4. Deploy Frontend (Netlify/Vercel)
- Push code to GitHub
- Connect repository to Netlify/Vercel
- Deploy!

### Testing Checklist

- [ ] Backend server รันได้ (http://localhost:3000/api/health)
- [ ] Frontend เปิดได้ (http://localhost:5500)
- [ ] กดปุ่ม "Book Now" เปิด modal ได้
- [ ] กรอกฟอร์มครบถ้วน
- [ ] Submit แล้วเห็น "⏳ Sending..." 
- [ ] Console แสดง "✅ Booking submitted successfully"
- [ ] Admin ได้รับอีเมล
- [ ] ลูกค้าได้รับอีเมลยืนยัน
- [ ] Success modal แสดงขึ้น

### ข้อมูลการส่ง

Form จะส่งข้อมูลนี้ไปยัง Backend:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phone": "+66912345678",
  "country": "Thailand",
  "selectedEvent": "waterloo",
  "packageType": "campaign-weekend",
  "checkIn": "27/12/2025",
  "checkOut": "29/12/2025",
  "nights": 2,
  "players": [
    {
      "name": "John Smith",
      "email": "john@example.com",
      "age": "25"
    }
  ],
  "adults": 1,
  "children": 0,
  "accommodation": "basic",
  "extras": ["spa-day", "family-tours"],
  "specialRequests": "Vegetarian meals",
  "hearAbout": "google",
  "language": "en",
  "timestamp": "2025-12-29T10:30:00.000Z"
}
```

### API Response

**Success:**
```json
{
  "success": true,
  "message": "Booking request received successfully",
  "bookingId": "WHC-1735467000000",
  "timestamp": "2025-12-29T10:30:00.000Z"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Missing required fields: firstName, lastName, email, phone"
}
```

### ต้องการความช่วยเหลือ?

📞 +66 (0) 92-721-9803  
✉️ info@wargameshc.com
