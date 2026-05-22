#  Distributed Task Queue - Frontend

The frontend interface for the Distributed Task Queue system, built with React and Vite. It provides a clean, modern dashboard for users to authenticate, manage, and track background tasks in real-time.

---

##  Core Concepts Covered

- **Modern UI Architecture:** Building a component-driven interface using React 19 and Vite for extremely fast HMR (Hot Module Replacement) and optimized builds.
- **Client-Side Routing:** Handling protected routes, dynamic URL parameters (`/task/:id`), and navigation state using `react-router-dom`.
- **Form Management & Validation:** Implementing complex, controlled forms using `react-hook-form` alongside custom Regex validation for specific domain requirements (`@gmail.com`, `@anurag.edu.in`).
- **Multipart Form Data:** Using `FormData` interfaces to securely handle and upload physical files (images) from the browser to the backend API.
- **Authentication State:** Managing JWT tokens inside `localStorage` and attaching them to outgoing Axios requests via headers.
- **Utility-First Styling:** Rapidly designing responsive, modern, and accessible user interfaces using `Tailwind CSS`.

---

##  Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **Forms:** React Hook Form
- **API Client:** Axios

---

##  Project Structure

```text
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI elements (Navbar, TaskForm, TaskCard)
│   ├── pages/       # Route components (Dashboard, Login, Register, TaskDetails, EditTask)
│   ├── services/    # API configuration (Axios instance)
│   ├── App.jsx      # Main application routing
│   └── main.jsx     # React entry point
├── eslint.config.js # Linting rules
├── tailwind.config  # Tailwind utility configuration
└── vite.config.js   # Vite bundler configuration
```

---

##  Installation & Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```

3. **Access the App:**
   Open your browser and navigate to the local URL provided by Vite (typically `http://localhost:5173`).

*(Note: Ensure the backend server is running on port 5000 so the frontend API requests resolve correctly).*

---

##  Usage Guide

1. **Authentication:** Create a new account on the Register page.
2. **Dashboard:** Once logged in, use the form to create new tasks. 
   - Choose between `Email`, `Image`, or `Report` task types.
   - For `Image` tasks, an optimized file upload UI allows you to select local files.
3. **Task Tracking:** Created tasks appear on the dashboard. Click "View Details" to see specific data (like the uploaded image rendering) or to edit/delete the task.
