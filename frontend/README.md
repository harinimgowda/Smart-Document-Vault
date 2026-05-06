# Smart Document Manager

A full-stack **Document Management System** built using the **MERN Stack** with **AI-powered document summarization** and **role-based authentication**.
This project allows users to upload, manage, search, and summarize documents efficiently.

The backend is built with **Node.js, Express.js, MongoDB**, and integrates AI services using **OpenRouter API**.

---

# 🚀 Features

## 🔐 Authentication & Authorization

* User Registration & Login
* JWT Authentication
* Role-Based Access Control
* Admin, Faculty, and Reviewer roles supported

## 📄 Document Management

* Upload multiple documents
* Store files securely
* Delete uploaded documents
* Search documents using keywords
* Supports:

  * PDF
  * DOC
  * DOCX
  * Images
  * Excel files

## 🤖 AI Features

* AI Chat Assistant
* Automatic document summarization
* Extract text from uploaded PDFs & DOCX files

## 🔍 Search System

* Full-text document search
* Highlight matching content
* MongoDB text indexing for faster searching

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router
* Axios
* Context API
* CSS / Inline Styling

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* OpenRouter API

---

# 📂 Project Structure

```bash
project-root/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   └── documentController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   └── documentModel.js
│   │
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   └── documentRoutes.js
│   │
│   ├── services/
│   │   └── aiService.js
│   │
│   ├── uploads/
│   │
│   ├── app.js
│   └── server.js
│
└── frontend/
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/iqac-document-system.git
cd iqac-document-system
```

---

# 📦 Backend Setup

## Install Dependencies

```bash
cd backend
npm install
```

## Create `.env` File

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

## Run Backend

```bash
npm start
```

OR

```bash
npm run dev
```

Server will run on:

```bash
http://localhost:5000
```

---

# 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# 🔑 Default Admin Login

The backend automatically creates a default admin account if no admin exists.

```bash
Email: admin@test.com
Password: admin123
```

---

# 📡 API Endpoints

## Authentication Routes

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| POST   | `/api/auth/register`       | Register user              |
| POST   | `/api/auth/login`          | Login user                 |
| GET    | `/api/auth/users`          | Get all users (Admin only) |
| PUT    | `/api/auth/users/:id/role` | Update user role           |
| DELETE | `/api/auth/users/:id`      | Delete user                |

---

## Document Routes

| Method | Endpoint                | Description      |
| ------ | ----------------------- | ---------------- |
| POST   | `/api/documents/upload` | Upload document  |
| GET    | `/api/documents`        | Get documents    |
| GET    | `/api/documents/search` | Search documents |
| DELETE | `/api/documents/:id`    | Delete document  |

---

## AI Routes

| Method | Endpoint       | Description  |
| ------ | -------------- | ------------ |
| POST   | `/api/ai/chat` | Chat with AI |

---

# 🔒 Authentication

Protected routes require JWT token:

```bash
Authorization: Bearer your_token
```

---

# 📄 Supported File Types

* PDF
* DOC
* DOCX
* JPG
* PNG
* XLS
* XLSX
* ZIP

---

# 🤖 AI Integration

The project uses **OpenRouter API** for:

* AI chat responses
* Document summarization

---

# 🧠 Database Models

## User Model

* Name
* Email
* Password
* Role

## Document Model

* Title
* Category
* File Path
* File Type
* Summary
* Full Text
* Uploaded By

---

# 🌟 Future Enhancements

* Document preview
* Download documents
* AI keyword extraction
* OCR support
* Dark mode
* Notifications system
* Audit logs

---

# 👩‍💻 Author

Developed by Harini

---

# 📜 License

This project is licensed under the MIT License.
