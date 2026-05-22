# Distributed Task Queue - Backend

The backend of the Distributed Task Queue system is built with Node.js, Express, and MongoDB. It features an asynchronous background job processing architecture utilizing Redis and Bull.

## Core Concepts Covered

- RESTful API Design: Modular routing for authentication and task management.
- Asynchronous Task Processing: Offloading heavy tasks to background workers.
- Message Queues: Implementing Bull and Redis to queue and track tasks.
- Multipart Data Handling: Parsing and storing uploaded image files using Multer.
- User Authentication: Secure signups and stateless authentication using JSON Web Tokens (JWT).
- Data Isolation: Enforcing database relationships so users can only access their own tasks.

## Tech Stack

- Node.js
- Express.js
- MongoDB and Mongoose
- Bull and Redis
- Multer for file uploads
- JSON Web Tokens (JWT) and bcryptjs

## Files

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

## Installation & Setup

1. Install Dependencies:
   `npm install`

2. Configure Environment:
   Ensure you have a `.env` file in the root of the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskqueue
   JWT_SECRET=your_jwt_secret_key
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   USE_REDIS=true
   ```

3. Start Required Services:
   Make sure MongoDB and Redis servers are running on your machine.

4. Run the Server:
   `npm start`
   The backend will now be running on `http://localhost:5000`.
