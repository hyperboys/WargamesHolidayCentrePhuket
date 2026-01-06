# Admin Dashboard - Wargames Holiday Centre Phuket

## 📋 Overview

Admin Dashboard สำหรับจัดการ Booking System โดยเชื่อมต่อกับ Backend API

## ✨ Features

### 🔐 Authentication
- Login/Logout
- JWT Token Management
- Session Management (Remember Me)
- Role-based Access Control (Admin/Staff)

### 📊 Dashboard
- สถิติภาพรวม (วันนี้, เดือนนี้)
- กราฟรายได้รายเดือน
- กราฟสถานะการจอง
- ตารางการจองล่าสุด

### 📅 Booking Management
- ดูรายการจองทั้งหมด
- ค้นหาและกรองการจอง
- ดูรายละเอียดการจอง
- อัพเดทสถานะการจอง
- Pagination

### 👥 User Management (Admin Only)
- ดูรายการ Users ทั้งหมด
- เพิ่ม User ใหม่
- แก้ไขข้อมูล User
- เปิด/ปิดใช้งาน User
- ลบ User

## 🚀 Getting Started

### Prerequisites

1. **Backend API ต้องทำงานอยู่:**
   ```bash
   cd ../WargamesHolidayCentrePhuket-Backend
   npm start
   ```
   API จะทำงานที่: `http://localhost:3000`

2. **สร้าง Admin User:**
   ```bash
   cd ../WargamesHolidayCentrePhuket-Backend
   node scripts/create-admin.js
   ```

### Installation

1. เปิดไฟล์ `login.html` ในเบราว์เซอร์:
   ```
   file:///d:/repos/WargamesHolidayCentrePhuket/login.html
   ```

2. หรือใช้ Live Server ใน VS Code:
   - คลิกขวาที่ `login.html`
   - เลือก "Open with Live Server"

## 📁 File Structure

```
WargamesHolidayCentrePhuket/
├── login.html          # หน้า Login
├── login.css          # สไตล์หน้า Login
├── login.js           # Logic หน้า Login
├── admin.html         # หน้า Admin Dashboard
├── admin.css          # สไตล์ Admin Dashboard
├── admin.js           # Logic Admin Dashboard
├── api-service.js     # Service สำหรับเรียก API
└── ADMIN_README.md    # เอกสารนี้
```

## 🔑 Login Credentials

ใช้ข้อมูลที่สร้างจาก `create-admin.js`:

```
Username: admin
Password: [ที่ตั้งไว้ตอนสร้าง]
```

## 📱 Pages & Features

### 1. Login Page (`login.html`)
- Login form
- Show/hide password
- Remember me
- Error handling
- Auto-redirect ถ้า login อยู่แล้ว

### 2. Dashboard (`admin.html#dashboard`)
- 📊 Stat cards (จองวันนี้, รายได้, ลูกค้า, กำลังเล่น)
- 📈 กราฟรายได้รายเดือน
- 🥧 กราฟสถานะการจอง
- 📋 ตารางการจองล่าสุด (5 รายการ)

### 3. Bookings Page (`admin.html#bookings`)
- ตารางแสดงการจองทั้งหมด
- Filter by: Status, Date, Event
- Pagination
- ดูรายละเอียด
- อัพเดทสถานะ

### 4. Users Page (`admin.html#users`) - Admin Only
- ตารางแสดง Users ทั้งหมด
- เพิ่ม User ใหม่
- แก้ไข User
- เปิด/ปิดใช้งาน
- ลบ User

## 🔌 API Endpoints Used

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Bookings
- `GET /api/booking/stats` - Dashboard stats
- `GET /api/booking` - Get bookings (pagination)
- `GET /api/booking/:id` - Get booking details
- `PUT /api/booking/:id/status` - Update status

### Users (Admin Only)
- `GET /api/users` - Get all users
- `POST /api/auth/register` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/toggle-active` - Toggle active

## 🔒 Security

### Token Management
- JWT Token stored in `localStorage` (Remember Me) หรือ `sessionStorage`
- Token expires in 7 days
- Auto-logout on 401 (Unauthorized)
- Token sent in `Authorization: Bearer <token>` header

### Role-based Access
- **Admin**: เข้าถึงได้ทุกฟีเจอร์
- **Staff**: เข้าถึงได้ยกเว้น User Management

## 🎨 UI/UX Features

- ✅ Responsive Design (Desktop, Tablet, Mobile)
- ✅ Dark sidebar, Light content
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications
- ✅ Modal dialogs
- ✅ Charts (Chart.js)
- ✅ Icons (Font Awesome)

## 🐛 Troubleshooting

### ❌ "Cannot connect to server"
- ตรวจสอบว่า Backend API ทำงานอยู่ที่ `http://localhost:3000`
- เช็ค CORS settings ใน Backend

### ❌ "Session expired"
- Token หมดอายุ (7 วัน)
- Login ใหม่

### ❌ "403 Forbidden"
- User ไม่มีสิทธิ์เข้าถึงฟีเจอร์นั้น
- เช็ค role ของ user

### ❌ "ไม่แสดงข้อมูล"
- เปิด Browser Console (F12) เช็ค error
- ตรวจสอบ API response

## 📝 Development Notes

### การเพิ่ม Feature ใหม่

1. **เพิ่ม API endpoint ใน `api-service.js`:**
   ```javascript
   async newFeature() {
       return this.request('/new-endpoint');
   }
   ```

2. **เพิ่ม UI ใน `admin.html`:**
   ```html
   <section id="new-page" class="page">
       ...
   </section>
   ```

3. **เพิ่ม Navigation ใน sidebar:**
   ```html
   <a href="#new" class="nav-item" data-page="new">
       <i class="fas fa-icon"></i>
       <span>New Feature</span>
   </a>
   ```

4. **เพิ่ม Logic ใน `admin.js`:**
   ```javascript
   async function loadNewPage() {
       const data = await apiService.newFeature();
       // Update UI
   }
   ```

## 🔄 Update Backend URL

ถ้า Backend ไม่ได้อยู่ที่ `localhost:3000` แก้ไขใน:

**api-service.js:**
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

**login.js:**
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## 📊 Charts Library

ใช้ **Chart.js** สำหรับแสดงกราฟ:
- Line Chart - รายได้รายเดือน
- Doughnut Chart - สถานะการจอง

## 🌐 Browser Support

- ✅ Chrome (แนะนำ)
- ✅ Firefox
- ✅ Edge
- ✅ Safari
- ⚠️ IE11 (บางฟีเจอร์อาจไม่ทำงาน)

## 📞 Support

หากมีปัญหาหรือข้อสงสัย:
1. เช็ค Browser Console (F12)
2. เช็ค Network Tab ดู API calls
3. เช็ค Backend logs

## 🚀 Production Deployment

### Frontend
1. Upload ไฟล์ทั้งหมดไปยัง Web Server
2. แก้ `API_BASE_URL` ให้เป็น Production URL
3. เปิด HTTPS

### Backend
1. ต้อง enable CORS สำหรับ Frontend domain
2. ใช้ HTTPS
3. ตั้งค่า `JWT_SECRET` ที่ปลอดภัย

## 📄 License

MIT License

## 👨‍💻 Author

Wargames Holiday Centre Phuket Development Team
