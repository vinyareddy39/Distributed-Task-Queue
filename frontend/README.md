# Distributed Task Queue - Frontend

The frontend interface for the Distributed Task Queue system is built with React and Vite. It provides a clean dashboard for users to authenticate, manage, and track background tasks in real-time.

## Core Concepts Covered

- Modern UI Architecture: Building a component-driven interface using React 19 and Vite.
- Client-Side Routing: Handling protected routes and navigation state using React Router.
- Form Management: Implementing controlled forms and custom Regex validation.
- Multipart Form Data: Securely handling and uploading physical files (images) from the browser.
- Authentication State: Managing JWT tokens inside localStorage and attaching them to Axios requests.
- Utility-First Styling: Designing responsive user interfaces using Tailwind CSS.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Axios

## Files

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

1. Install Dependencies:
   `npm install`

2. Run the Development Server:
   `npm run dev`

3. Access the App:
   Open your browser and navigate to the local URL provided by Vite (typically `http://localhost:5173`).

Note: Ensure the backend server is running on port 5000 so the frontend API requests resolve correctly.
