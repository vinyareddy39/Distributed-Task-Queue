#  Distributed Task Queue System

A robust, full-stack MERN application demonstrating a scalable distributed task queue architecture. This system allows authenticated users to offload heavy, asynchronous background tasks (like processing images, sending emails, and generating reports) to background workers using Redis and Bull.

---

##  Features

- **User Authentication:** Secure signup and login using JSON Web Tokens (JWT) and bcrypt password hashing.
- **Data Isolation:** Tasks are securely tied to the user who created them; users have private, isolated dashboards.
- **Asynchronous Processing:** Long-running tasks are offloaded to background workers, keeping the UI fast and responsive.
- **Distributed Queueing:** Uses `Bull` and `Redis` to manage job queues, handle retries, and track job statuses (`pending`, `processing`, `completed`, `failed`).
- **File Uploads:** Supports secure multipart image uploads directly to the backend using `Multer`.
- **Dynamic Frontend:** Built with React and Vite for blazing-fast performance, styled professionally with Tailwind CSS.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS 
- **Routing:** React Router v7
- **Form Handling:** React Hook Form
- **Network Requests:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Task Queue:** Bull & Redis
- **File Uploads:** Multer
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs

---

## Project Structure

```text
distributed-task-queue/
├── backend/
│   ├── models/          # Mongoose database schemas (User, Task)
│   ├── routes/          # Express API routes (Auth, Tasks)
│   ├── services/        # Business logic for specific task types
│   ├── uploads/         # Static directory for uploaded images
│   ├── utils/           # Helper functions (JWT verification, retry handlers)
│   ├── workers/         # Bull background worker logic (email, image, report)
│   └── server.js        # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable React components (Navbar, TaskForm, TaskCard)
    │   ├── pages/       # Route-level components (Login, Register, Dashboard, EditTask)
    │   └── services/    # Axios API configuration
    └── package.json     # Frontend dependencies
```

---

##  Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas URI)
- [Redis](https://redis.io/) (running locally on port `6379`)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskqueue
   JWT_SECRET=your_super_secret_key
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   USE_REDIS=true
   ```
4. Start the backend server:
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

##  Usage

1. Open your browser and navigate to `http://localhost:5173` (or the port Vite provides).
2. **Register** a new account, then **Log in**.
3. You will be redirected to your personal **Dashboard**.
4. Use the task creation form to create a new task:
   - **Email:** Provide a valid `@gmail.com` or `@anurag.edu.in` email.
   - **Image:** Upload a local image file.
   - **Report:** Provide a report name.
5. The task will instantly appear on your dashboard with a status of `pending`. Background workers will automatically pick it up and update its status to `processing` and finally `completed`.
6. Click "View Details" to see task metadata or edit/delete tasks.

---

### API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate a user and return a JWT

### Tasks (Requires Bearer Token)
- `POST /api/task` - Create a new task (supports `multipart/form-data` for images)
- `GET /api/tasks` - Retrieve all tasks belonging to the authenticated user
- `GET /api/task/:id` - Retrieve specific task details
- `PATCH /api/task/:id` - Update a specific task
- `DELETE /api/task/:id` - Delete a specific task

---


---

##  Future Improvements

- **WebSockets / Socket.io:** Push real-time task status updates to the frontend without requiring page refreshes.
- **Pagination:** Add pagination to the dashboard for users with thousands of tasks.
- **Admin Panel:** Create a system-wide view for admins to monitor queue health and server memory usage.
- **Cloud Storage:** Integrate AWS S3 or Cloudinary to replace local disk storage for image uploads.

---

##  Author

- GitHub: [vinyareddy39](https://github.com/vinyareddy39)
