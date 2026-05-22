import { useEffect, useState } from "react";

import api from "../services/api";

import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import Loader from "../components/Loader";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await api.get("/tasks", {
        headers: {
          Authorization: token,
        },
      });

      setTasks(response.data);

      setLoading(false);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="max-w-5xl mx-auto p-6">

        <h1 className="text-4xl font-bold mb-6">
          Dashboard
        </h1>

        <TaskForm fetchTasks={fetchTasks} />

        {
          loading ? (
            <Loader />
          ) : (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} fetchTasks={fetchTasks} />
            ))
          )
        }

      </div>
    </div>
  );
}

export default Dashboard;