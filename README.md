


# 🚀 TaskFlow — Backend Developer Intern Assignment

> A production-ready full-stack task management platform built with modern backend architecture, JWT authentication, RBAC authorization, PostgreSQL, Docker, and React.

---

# 🌐 Live Demo

### **Frontend**
🔗 **https://backend-developer-intern-assignment.vercel.app/login**

### **Backend API**
🔗 **https://backend-developer-intern-assignment-a8ni.onrender.com**

### **API Documentation**
🔗 **https://backend-developer-intern-assignment-a8ni.onrender.com/api-docs**

---

# 📌 Project Overview

TaskFlow is a secure and scalable task management system designed with production-grade backend practices.

The platform includes:

- JWT Authentication
- Role-Based Access Control (RBAC)
- PostgreSQL database integration
- RESTful API architecture
- Dockerized deployment
- Swagger API documentation
- Production deployment on Render & Vercel
- Responsive frontend UI

---

# ✨ Features

## 🔐 Authentication & Security

- User Registration & Login
- JWT Access & Refresh Tokens
- Password Hashing using bcrypt
- Protected Routes
- Role-Based Access Control
- Rate Limiting
- Helmet Security Middleware
- CORS Protection
- Request Validation using Zod

---

## 📋 Task Management

- Create Tasks
- Update Tasks
- Delete Tasks
- Assign Task Status
- Task Ownership Validation
- Pagination Support
- Filtering & Search

---

## 👨‍💼 Admin Features

- Admin-only endpoints
- Role-based middleware
- User privilege validation

---

## 📖 API Documentation

Interactive Swagger documentation available at:

```bash
/api-docs
````

---

# 🛠️ Tech Stack

| Category            | Technology        |
| ------------------- | ----------------- |
| Frontend            | React + Vite      |
| Backend             | Node.js + Express |
| Database            | PostgreSQL        |
| ORM / Query Builder | Knex.js           |
| Authentication      | JWT               |
| Validation          | Zod               |
| Documentation       | Swagger           |
| Deployment          | Render + Vercel   |
| Containerization    | Docker            |
| Testing             | Jest + Supertest  |

---

# 🏗️ System Architecture

```text
Frontend (React + Vite)
        ↓
REST API (Express.js)
        ↓
Authentication Layer (JWT + RBAC)
        ↓
PostgreSQL Database
```

---

# 📂 Project Structure

```bash
.
├── backend
│   ├── database
│   │   ├── migrations
│   │   └── seeds
│   ├── src
│   │   ├── config
│   │   ├── middleware
│   │   ├── modules
│   │   ├── routes
│   │   ├── utils
│   │   ├── app.js
│   │   └── server.js
│   ├── tests
│   ├── Dockerfile
│   └── package.json
│
├── frontend
│   ├── src
│   ├── public
│   ├── vercel.json
│   └── package.json
│
└── README.md
```

---

# ⚙️ Backend Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/AtharvaPagar04/Backend-Developer-Intern-Assignment.git
```

---

## 2️⃣ Backend Installation

```bash
cd backend
npm install
```

---

## 3️⃣ Configure Environment Variables

Create:

```bash
.env
```

Example:

```env
NODE_ENV=development

PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=intern_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_secret_key

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

---

## 4️⃣ Run Database Migrations

```bash
npm run migrate
```

---

## 5️⃣ Start Backend Server

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 💻 Frontend Setup

## 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

---

## 2️⃣ Create Environment File

Create:

```bash
.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 3️⃣ Start Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🐳 Docker Setup

## Build Docker Image

```bash
docker build -t taskflow-backend .
```

---

## Run Docker Container

```bash
docker run -p 5000:5000 taskflow-backend
```

---

# ☁️ Deployment

## Backend Deployment

* Render
* Dockerized Express server
* Neon PostgreSQL database

---

## Frontend Deployment

* Vercel
* React + Vite production build

---

# 🧪 Running Tests

```bash
npm test
```

---

# ✅ Test Coverage

* Authentication APIs
* RBAC middleware
* Task routes
* Health routes

---

# 🔒 Security Practices

* Password hashing
* JWT authentication
* Protected routes
* Rate limiting
* Input validation
* Secure HTTP headers
* Role-based authorization

---

# 📸 Screenshots

## Login Page

<img width="100%" alt="Login Page" src="YOUR_SCREENSHOT_URL_HERE" />

---

# 📈 Future Improvements

* Email verification
* Password reset flow
* Redis caching
* WebSocket notifications
* Activity logging
* CI/CD pipelines
* Kubernetes deployment

---

# 👨‍💻 Author

### Atharva Pagar

* GitHub: [https://github.com/AtharvaPagar04](https://github.com/AtharvaPagar04)
* LinkedIn: [https://linkedin.com/in/YOUR_LINKEDIN](https://linkedin.com/in/YOUR_LINKEDIN)

---

# ⭐ Conclusion

This project demonstrates:

* Production-grade backend engineering
* Secure authentication systems
* REST API architecture
* Database integration
* Docker deployment workflows
* Frontend-backend integration
* Full-stack deployment practices

```
```
