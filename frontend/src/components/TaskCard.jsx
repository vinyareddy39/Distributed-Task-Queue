import { Link } from "react-router-dom";
import api from "../services/api";

function TaskCard({ task, fetchTasks }) {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/task/${task._id}`, {
        headers: { Authorization: token },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };




  return (
    <div className="bg-white p-5 rounded-xl shadow-md mb-5">
      <h2 className="text-2xl font-bold capitalize">{task.taskType}</h2>

      <p className="mt-2">Status: {task.status}</p>

      <Link to={`/task/${task._id}`} className="text-blue-500 mt-3 inline-block">
        View Details
      </Link>

      
    </div>
  );
}

export default TaskCard;
