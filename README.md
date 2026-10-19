# โจทย์ชุด B : ข่าว

ระบบจัดการข่าวสาร พัฒนาด้วย **Node.js (Express)**, **React.js**, **Tailwind CSS**, **DaisyUI** และ **Sequelize (PostgreSQL)**

---

## ายละเอียดการพัฒนา

- **Backend:** Node.js + Express
- **Frontend:** React.js + Tailwind CSS + DaisyUI
- **Database:** สร้างฐานข้อมูล Sequelize โดยตั้งค่าตัวแปรเชื่อมต่อฐานข้อมูลใน `config/database.js`
- **Model:** สร้างตารางใน `model` เพื่อกำหนดข้อมูลและชนิดข้อมูล
- **Controller:** จัดการการทำงานของแต่ละ Function (เพิ่ม, ลบ, แก้ไข, ค้นหา, กรอง)
- **Router:** จัดการเส้นทาง (Route) ที่ส่งมาให้ถูกต้องกับ Controller

---

## คำสั่งติดตั้ง Dependencies

### 1. คำสั่งติดตั้ง Dependencies ที่ใช้ใน Backend
```bash
npm init -y
npm i express cors dotenv pg pg-hstore sequelize
npm i -D nodemon
```

### 2. คำสั่งสร้าง Frontend และติดตั้ง Dependencies ที่ใช้
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm i react-router sweetalert2 lucide-react tailwindcss @tailwindcss/vite
npm i -D daisyui
```

---

## คำสั่งการรันระบบ

### 1. คำสั่งรันด้วย Docker Compose
```bash
docker compose up -d
```

---

### 2. คำสั่งรันแบบแยกกัน

> **หมายเหตุ:** กรุณาแยก Terminal สำหรับรันแต่ละส่วน

1. **ฐานข้อมูล PostgreSQL:**  
   ต้องรัน PostgreSQL ให้อยู่ที่ port `5432` หรือตามที่กำหนดไว้ใน `.env`

2. **รัน Backend:**
   ```bash
   cd backend
   npm i
   npm run dev
   ```

3. **รัน Frontend:** *(แยก Terminal อีกหน้าต่าง)*
   ```bash
   cd frontend
   npm i
   npm run dev
   ```