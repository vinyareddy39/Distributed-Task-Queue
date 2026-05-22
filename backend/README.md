#  Distributed Task Queue - Backend

The backend of the Distributed Task Queue system is built with Node.js, Express, and MongoDB. It features a scalable, asynchronous background job processing architecture utilizing Redis and Bull.

---

##  Core Concepts Covered

- **RESTful API Design:** Clean, modular routing with `express.Router` for authentication and task management.
- **Asynchronous Task Processing:** Offloading heavy or long-running tasks (like image processing, email sending, or report generation) to background workers so the main API thread isn't blocked.
- **Message Queues:** Implementing `Bull` and `Redis` to queue, retry, and track the status of distributed tasks across workers.
- **Multipart Data Handling:** Securely parsing and storing uploaded image files using `Multer`.
- **User Authentication:** Managing secure signups, encrypted passwords with `bcryptjs`, and stateless authentication using JSON Web Tokens (JWT).
- **Data Isolation:** Enforcing database relationships so users can only access their own tasks.

---

##  Tech Stack

- **Runtime:** Node.js
- **Web Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Queue System:** Bull
- **In-Memory Store:** Redis
- **File Uploads:** Multer
- **Security:** jsonwebtoken (JWT), bcryptjs, cors

---

##  Project Structure

```text
backend/
├── models/          # Database schemas (User, Task)
├── routes/          # Express route definitions
├── services/        # Business logic for specific workers (email, image, report)
├── uploads/         # Local storage for image uploads
├── utils/           # Shared utilities (JWT verification, logging, retries)
├── workers/         # Background worker definitions for processing queues
├── .env             # Environment variables
└── server.js        # Main Express application entry point
```

---

##  Installation & Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Ensure you have a `.env` file in the root of the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskqueue
   JWT_SECRET=your_jwt_secret_key
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   USE_REDIS=true
   ```

3. **Start Required Services:**
   Make sure **MongoDB** and **Redis** servers are running on your machine.

4. **Run the Server:**
   ```bash
   npm start
   ```
   The backend will now be running on `http://localhost:5000`.

---

##  API Endpoints

### Authentication
- `POST /api/auth/register` - Registers a new user.
- `POST /api/auth/login` - Authenticates a user and returns a JWT.

### Tasks (Requires Bearer Token)
- `POST /api/task` - Add a new task to the queue.
- `GET /api/tasks` - Get all tasks for the logged-in user.
- `GET /api/task/:id` - Get details for a specific task.
- `PATCH /api/task/:id` - Update an existing task.
- `DELETE /api/task/:id` - Delete a task.
