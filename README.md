# 🌿 AyurCare — AI-Powered Ayurvedic Healthcare Platform

<div align="center">

![AyurCare Banner](https://nrb.net.in/img/t2.jpg)

**A full-stack Ayurvedic healthcare web application combining 5,000 years of Ayurvedic wisdom with modern AI technology.**

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-412991?style=for-the-badge&logo=openai)](https://openai.com/)

</div>

---

## ✨ Features

### 🧠 AI Health Analysis
- 5-step health form — Personal, Health, Ayurveda, Optional & Analyze
- AI-powered Ayurvedic analysis using OpenAI GPT-3.5 Turbo
- Smart fallback engine when OpenAI key is not configured
- Personalized diet plan from Morning to Bedtime
- Recommended medicines, treatments, yoga & daily routine
- Full analysis history saved to MongoDB

### 👨‍⚕️ Doctors
- Browse 12 certified Indian Ayurvedic specialists
- Search & filter by specialty
- Book appointments with date, time slot & health concern
- View doctor profiles, ratings, experience & patient reviews

### 🌿 Medicines
- Browse 12 authentic Ayurvedic herbal medicines
- Search & filter by category (Immunity, Digestion, Skin Care, etc.)
- Add to cart & buy now functionality
- Wishlist feature

### 🧘 Treatments
- Browse 12 traditional Ayurvedic therapies
- Panchakarma, Shirodhara, Abhyanga, Nasya & more
- Book treatments at multiple centers
- View benefits, procedure steps & FAQs

### 🛒 Cart & Orders
- Persistent cart with localStorage
- Checkout with address & payment method
- Order history tracking

### 🔐 Authentication
- Register & Login with JWT tokens
- Protected routes for authenticated users
- User dashboard with appointments, orders & bookings

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 19, Tailwind CSS, React Router DOM v7 |
| Backend | Node.js, Express.js 4 |
| Database | MongoDB Atlas, Mongoose |
| AI | OpenAI GPT-3.5 Turbo |
| Authentication | JWT, bcryptjs |
| HTTP Client | Axios |
| Notifications | React Hot Toast |

---

## 📁 Project Structure

```
Ayurvedic-Healthcare/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT auth middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Medicine.js
│   │   ├── Treatment.js
│   │   ├── Appointment.js
│   │   ├── Order.js
│   │   ├── TreatmentBooking.js
│   │   └── HealthAnalysis.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── doctors.js
│   │   ├── medicines.js
│   │   ├── treatments.js
│   │   ├── appointments.js
│   │   ├── orders.js
│   │   ├── treatmentBookings.js
│   │   └── ai.js
│   ├── seed.js                  # Database seeder
│   ├── server.js                # Express server
│   └── package.json
└── frontend/
    └── src/
        ├── components/
        │   └── Navbar.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   └── CartContext.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Doctors.jsx
        │   ├── DoctorDetails.jsx
        │   ├── Medicines.jsx
        │   ├── Treatments.jsx
        │   ├── TreatmentDetails.jsx
        │   ├── AIHealthAnalysis.jsx
        │   ├── AIAnalysisHistory.jsx
        │   ├── CartPage.jsx
        │   ├── CheckoutPage.jsx
        │   ├── OrderSuccess.jsx
        │   ├── MyAppointments.jsx
        │   ├── MyOrders.jsx
        │   ├── MyTreatmentBookings.jsx
        │   ├── AuthPage.jsx
        │   └── Contact.jsx
        └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- OpenAI API key (optional)

### 1. Clone the repository
```bash
git clone https://github.com/marepallyvaishnavigoud/Ayurvedic-Healthcare.git
cd Ayurvedic-Healthcare
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
OPENAI_API_KEY=your_openai_api_key
```

Seed the database:
```bash
node seed.js
```

Start the backend server:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

The app will open at **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/doctors` | Get all doctors | ❌ |
| GET | `/api/doctors/:id` | Get doctor by ID | ❌ |
| GET | `/api/medicines` | Get all medicines | ❌ |
| GET | `/api/treatments` | Get all treatments | ❌ |
| GET | `/api/treatments/:id` | Get treatment by ID | ❌ |
| POST | `/api/appointments` | Book appointment | ✅ |
| GET | `/api/appointments/mine` | Get my appointments | ✅ |
| POST | `/api/orders` | Place order | ✅ |
| GET | `/api/orders/mine` | Get my orders | ✅ |
| POST | `/api/treatment-bookings` | Book treatment | ✅ |
| GET | `/api/treatment-bookings/mine` | Get my bookings | ✅ |
| POST | `/api/ai/analyze` | AI health analysis | ✅ |
| GET | `/api/ai/history` | Get analysis history | ✅ |

---

## 📸 Pages Overview

| Page | Description |
|------|-------------|
| Home | Hero section, stats, features, testimonials |
| Doctors | Browse & search Indian Ayurvedic doctors |
| Medicines | Herbal medicine shop with cart |
| Treatments | Ayurvedic therapy booking |
| AI Health Analysis | AI-powered personalized health report |
| AI History | Past analysis reports |
| Cart & Checkout | Order placement |
| My Dashboard | Appointments, orders & bookings |

---

## 👩‍💻 Developed By

**Marepallyvaishnavigoud**

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
