# Frontend Testing Checklist

## 🚀 ขั้นตอนการทดสอบ Frontend

### ✅ เตรียมความพร้อม

#### 1. ตรวจสอบ Backend กำลังรัน
```powershell
cd d:\repos\WargamesHolidayCentrePhuket-Backend
npm run dev
```

**ผลลัพธ์ที่ต้องเห็น:**
```
🚀 Server running on port 3000
📧 Email configured: info@wargameshc.com
✅ Email server is ready to send messages
```

**ทดสอบ Backend:**
เปิดเบราว์เซอร์ไปที่:
- http://localhost:3000/api/health ← ต้องเห็น `{"status":"OK",...}`
- http://localhost:3000/api/booking/test ← ต้องเห็น `{"success":true,...}`

#### 2. เปิด Frontend
```powershell
cd d:\repos\WargamesHolidayCentrePhuket

# วิธีที่ 1: VS Code Live Server (แนะนำ)
# คลิกขวาที่ index.html → Open with Live Server

# วิธีที่ 2: Python
python -m http.server 5500

# วิธีที่ 3: Node.js
npx http-server -p 5500 -c-1
```

**เปิดเบราว์เซอร์:**
- http://localhost:5500
- หรือ http://127.0.0.1:5500

---

## 🧪 การทดสอบ

### Test 1: ตรวจสอบ Console
เปิด Browser Console (กด F12)

**ควรเห็น:**
```
✅ Backend connected successfully
```

**ถ้าเห็น:**
```
⚠️ Backend not available: Failed to fetch
💡 Make sure backend is running at: http://localhost:3000
```
→ Backend ยังไม่รัน หรือรันผิด port

---

### Test 2: ทดสอบเปิด Booking Modal

1. **กดปุ่ม "Book Now"** หรือ "จองเลย" (ที่ pricing section)
2. **ตรวจสอบ:**
   - [ ] Modal เปิดขึ้นมา
   - [ ] Form แสดงครบถ้วน
   - [ ] มี Player 1 ปรากฏเริ่มต้น
   - [ ] ปุ่ม "+ Add Player" แสดง
   - [ ] Price Estimate แสดง (2 nights estimated)

---

### Test 3: ทดสอบเปลี่ยนภาษา

1. **กดปุ่มธง (ขวาบน)**
2. **เลือกภาษา:**
   - [ ] เปลี่ยนเป็นไทย → ข้อความเปลี่ยนเป็นภาษาไทย
   - [ ] เปลี่ยนเป็น English → ข้อความเปลี่ยนเป็นภาษาอังกฤษ
3. **ตรวจสอบ Booking Modal:**
   - [ ] Label เปลี่ยนตามภาษา
   - [ ] Placeholder เปลี่ยนตามภาษา
   - [ ] ปุ่มเปลี่ยนตามภาษา

---

### Test 4: ทดสอบกรอกฟอร์ม

#### A. กรอก Personal Information
- [x] First Name: `Test`
- [x] Last Name: `User`
- [x] Email: `test@example.com`
- [x] Phone: `+66912345678`
- [x] Country: `Thailand`

#### B. กรอก Booking Details
- [x] Event: เลือก "Battle of Waterloo"
- [x] Package: "Campaign Weekend (Hosted by WHC)"
- [x] Check-in: `30/12/2025`
- [x] Check-out: `01/01/2026`
- [x] Accommodation: "Basic (Included)"

#### C. Players Information
- [x] Player 1 ปรากฏอยู่แล้ว
- [x] กรอก First Name: `Test`
- [x] กรอก Last Name: `User`
- [x] กรอก Age: `25`
- [x] กรอก Email: `test@example.com`

#### D. Companions (ถ้ามี)
- [ ] Adult Companions: `1`
- [ ] Child Companions: `0`

#### E. ตรวจสอบ Price Estimate
- [ ] แสดงราคา Players
- [ ] แสดงราคา Adult Companions (ถ้ามี)
- [ ] แสดง Total Price
- [ ] ถ้าเป็นภาษาอังกฤษ → แสดง USD
- [ ] ถ้าเป็นภาษาไทย → แสดง THB

---

### Test 5: ทดสอบ Submit Form

1. **กด "Send Booking Request"** หรือ "ส่งคำขอจอง"

2. **ตรวจสอบ Loading State:**
   - [ ] ปุ่มเปลี่ยนเป็น "⏳ Sending..." หรือ "⏳ กำลังส่ง..."
   - [ ] ปุ่ม disabled (กดไม่ได้)

3. **ตรวจสอบ Console (F12):**
   ```
   📤 Sending booking request: {firstName: "Test", ...}
   ✅ Booking submitted successfully: {success: true, bookingId: "WHC-..."}
   ```

4. **ตรวจสอบผลลัพธ์:**
   - [ ] Booking Modal ปิด
   - [ ] Success Modal เปิดขึ้น
   - [ ] ข้อความยืนยันแสดง (ภาษาไทย/อังกฤษ)

5. **ตรวจสอบ Email:**
   - [ ] Admin ได้รับอีเมลแจ้งเตือน (info@wargameshc.com)
   - [ ] ลูกค้าได้รับอีเมลยืนยัน (test@example.com)

---

### Test 6: ทดสอบ Event Booking

1. **ไปที่ Events Section**
2. **กดปุ่ม "View Details"** ที่ event card
3. **ใน Event Modal กด "Register Now"** หรือ "ลงทะเบียนเลย"

**ตรวจสอบ:**
- [ ] Booking Modal เปิดขึ้น
- [ ] Event Information แสดง (title, date, duration)
- [ ] วันที่ check-in/check-out ถูก pre-fill แล้ว
- [ ] วันที่ช่อง disabled (แก้ไม่ได้)
- [ ] Package เป็น "Campaign Weekend" อัตโนมัติ
- [ ] **Price แสดงทันที** (คำนวณจากวันที่ของ event)

---

## ❌ การแก้ปัญหา

### ปัญหา: Backend not available

**อาการ:**
```
⚠️ Backend not available: Failed to fetch
```

**วิธีแก้:**
1. ตรวจสอบว่า Backend รันอยู่:
   ```powershell
   cd d:\repos\WargamesHolidayCentrePhuket-Backend
   npm run dev
   ```

2. ตรวจสอบ port (ต้องเป็น 3000)

3. ทดสอบ URL ใน browser: http://localhost:3000/api/health

---

### ปัญหา: CORS Error

**อาการ:**
```
Access to fetch at 'http://localhost:3000' from origin 'http://localhost:5500' 
has been blocked by CORS policy
```

**วิธีแก้:**
Backend มี CORS config อยู่แล้ว แต่ถ้ายังมีปัญหา:

1. ตรวจสอบ `.env` ใน Backend:
   ```
   FRONTEND_URL=http://localhost:5500
   ```

2. Restart backend server

---

### ปัญหา: Form ส่งไม่ได้

**อาการ:**
- กด Submit แล้วไม่เกิดอะไร
- หรือเห็น error ใน console

**วิธีแก้:**
1. ตรวจสอบว่ากรอกข้อมูล required fields ครบ:
   - First Name
   - Last Name  
   - Email
   - Phone
   - Check-in Date
   - Check-out Date

2. ตรวจสอบรูปแบบวันที่: `DD/MM/YYYY` เช่น `30/12/2025`

3. ตรวจสอบ Console (F12) ดู error message

---

### ปัญหา: Email ไม่ส่ง

**อาการ:**
- Booking สำเร็จแต่ไม่ได้รับอีเมล

**วิธีแก้:**
1. ตรวจสอบ Backend console มี error หรือไม่

2. ตรวจสอบ `.env`:
   ```
   EMAIL_USER=info@wargameshc.com
   EMAIL_PASS=your_app_password_here
   ```

3. ตรวจสอบว่าใส่ App Password ถูกต้อง (ไม่ใช่รหัสผ่านปกติ)

4. Restart backend server

---

## 📊 Test Results

| Test | Status | Notes |
|------|--------|-------|
| Backend Connected | ⬜ | |
| Modal Opens | ⬜ | |
| Language Switch | ⬜ | |
| Form Validation | ⬜ | |
| Price Calculation | ⬜ | |
| Form Submit | ⬜ | |
| Email Sent to Admin | ⬜ | |
| Email Sent to Customer | ⬜ | |
| Event Booking | ⬜ | |
| Success Modal | ⬜ | |

เครื่องหมาย:
- ⬜ ยังไม่ได้ทดสอบ
- ✅ ผ่าน
- ❌ ไม่ผ่าน

---

## 🎯 ถัดไป

หลังจากทดสอบผ่านหมดแล้ว:

1. [ ] Setup Git repository (ทั้ง frontend และ backend)
2. [ ] Deploy backend (Railway/Render)
3. [ ] Update API_BASE_URL ใน frontend เป็น production URL
4. [ ] Deploy frontend (Netlify/Vercel)
5. [ ] ทดสอบ production environment
6. [ ] Update Google Workspace Email settings (ถ้าจำเป็น)

---

## 📞 ต้องการความช่วยเหลือ?

ถ้ามีปัญหาหรือข้อสงสัย:
- ดู `API_INTEGRATION.md` สำหรับรายละเอียด
- ดู Backend `README.md` สำหรับการตั้งค่า email
- ติดต่อ: info@wargameshc.com
