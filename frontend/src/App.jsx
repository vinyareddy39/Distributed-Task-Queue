import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import EditTask from "./pages/EditTask";
import TaskDetails from "./pages/TaskDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/task/:id" element={<TaskDetails />} />
      <Route path="/task/:id/edit" element={<EditTask />} />
    </Routes>
  );
}

export default App;