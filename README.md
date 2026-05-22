# Distributed Task Queue System

A full-stack MERN application that demonstrates a scalable distributed task queue architecture. This system allows authenticated users to create and offload asynchronous background tasks (such as processing images, sending emails, and generating reports) to background workers using Redis and Bull.

## Features

- User Authentication: Secure signup and login using JSON Web Tokens (JWT) and bcrypt.
- Data Isolation: Tasks are tied to the user who created them.
- Asynchronous Processing: Long-running tasks are offloaded to background workers.
- Distributed Queueing: Uses Bull and Redis to manage job queues and track task status.
- File Uploads: Supports multipart image uploads directly to the backend.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, MongoDB, Bull, Redis, Multer, JWT

## Files

### Backend
- server.js — Main Express server and middleware setup
- models/Task.js — Database schema for tasks
- models/User.js — Database schema for users
- routes/authRoutes.js — API endpoints for user registration and login
- routes/taskRoutes.js — API endpoints for task creation, retrieval, updating, and deletion
- services/emailService.js — Logic for sending emails
- services/imageService.js — Logic for processing images
- services/reportService.js — Logic for generating reports
- utils/logger.js — Utility for logging task progress
- utils/retryHandler.js — Utility for retrying failed tasks
- utils/verifyToken.js — Middleware to verify JWT authentication tokens
- workers/emailWorker.js — Background worker for processing email tasks
- workers/imageWorker.js — Background worker for processing image tasks
- workers/reportWorker.js — Background worker for processing report tasks

### Frontend
- src/App.jsx — Main application routing configuration
- src/main.jsx — React entry point
- src/components/Loader.jsx — Loading spinner component
- src/components/Navbar.jsx — Navigation bar component
- src/components/TaskCard.jsx — Component to display brief task information
- src/components/TaskForm.jsx — Form to create new tasks and upload files
- src/pages/Dashboard.jsx — Dashboard page displaying a list of user tasks
- src/pages/EditTask.jsx — Page to edit existing tasks
- src/pages/Login.jsx — User login page
- src/pages/Register.jsx — User registration page
- src/pages/TaskDetails.jsx — Page displaying detailed information for a specific task
- src/services/api.js — Axios instance configuration for API requests

## Installation & Setup

1. Backend Setup:
   - Navigate to the backend directory: `cd backend`
   - Install dependencies: `npm install`
   - Create a `.env` file with PORT, MONGO_URI, JWT_SECRET, REDIS_HOST, REDIS_PORT, and USE_REDIS
   - Start the backend server: `npm start`

2. Frontend Setup:
   - Navigate to the frontend directory: `cd frontend`
   - Install dependencies: `npm install`
   - Start the Vite server: `npm run dev`
