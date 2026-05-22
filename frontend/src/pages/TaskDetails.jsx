import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../services/api";

import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

function TaskDetails() {

  const { id } = useParams();

  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/task/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        setTask(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTask();
  }, [id]);

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/task/${id}`, { headers: { Authorization: token } });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  if (!task) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-5">Task Details</h1>
          <h2 className="text-xl capitalize mb-3">Task Type: {task.taskType}</h2>
          <p className="mb-2">Status: {task.status}</p>
          <p className="mb-4">Retry Count: {task.retryCount}</p>

          {/* Show task-specific data */}
          {task.taskType === "email" && task.data?.email && (
            <p className="mb-4">Email: {task.data.email}</p>
          )}
          {task.taskType === "report" && task.data?.reportName && (
            <p className="mb-4">Report: {task.data.reportName}</p>
          )}
          {task.taskType === "image" && task.data?.imagePath && (
            <div className="mb-4">
              <p className="mb-2">Image: {task.data.imageName}</p>
              <img
                src={`http://localhost:5000${task.data.imagePath}`}
                alt={task.data.imageName || "Uploaded image"}
                className="max-w-full max-h-80 object-contain rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => navigate(`/task/${id}/edit`, { state: task })}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;