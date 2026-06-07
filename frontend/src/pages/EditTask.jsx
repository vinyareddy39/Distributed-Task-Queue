import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../services/api";

function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const taskType = watch("taskType", state?.taskType || "");
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    if (!state) {
      // If no state (e.g., page refreshed), fetch the task directly
      const fetchTask = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await api.get(`/task/${id}`, { headers: { Authorization: token } });
          const task = res.data;
          setValue("taskType", task.taskType);
          // Populate data fields based on type
          if (task.taskType === "email") setValue("email", task.data?.email || "");
          else if (task.taskType === "image") {
            setCurrentImage(task.data?.imagePath || "");
          }
          else if (task.taskType === "report") setValue("reportName", task.data?.reportName || "");
        } catch (err) {
          console.error(err);
        }
      };
      fetchTask();
      return;
    }
    // Populate form from navigation state
    setValue("taskType", state.taskType);
    if (state.taskType === "email") setValue("email", state.data?.email || "");
    else if (state.taskType === "image") {
      setCurrentImage(state.data?.imagePath || "");
    }
    else if (state.taskType === "report") setValue("reportName", state.data?.reportName || "");
  }, [state, setValue, id]);

  const onSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      if (formData.taskType === "image") {
        // Use FormData for image upload
        const fd = new FormData();
        fd.append("taskType", "image");
        if (imageFile) {
          fd.append("image", imageFile);
        } else {
          // Keep existing image data
          fd.append("data", JSON.stringify({ imagePath: currentImage }));
        }
        const res = await api.patch(`/task/${id}`, fd, {
          headers: { Authorization: token, "Content-Type": "multipart/form-data" },
        });
        if (res.status === 200) navigate("/dashboard");
      } else {
        const payload = { taskType: formData.taskType };
        if (formData.taskType === "email") payload.data = { email: formData.email };
        else if (formData.taskType === "report") payload.data = { reportName: formData.reportName };
        const res = await api.patch(`/task/${id}`, payload, { headers: { Authorization: token } });
        if (res.status === 200) navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 mt-10">
      <h1 className="text-center text-3xl font-light text-zinc-900 mb-8 tracking-tight">Edit Task</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <select {...register("taskType")} className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 transition">
          <option value="email">Email</option>
          <option value="image">Image</option>
          <option value="report">Report</option>
        </select>
        {taskType === "email" && (
          <>
            <input
              type="email"
              placeholder="Email address"
              {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@(gmail\.com|anurag\.edu\.in)$/i, message: "Email must end with @gmail.com or @anurag.edu.in" } })}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </>
        )}
        {taskType === "image" && (
          <>
            {currentImage && (
              <div className="mb-2">
                <p className="text-sm text-zinc-500 mb-1">Current image:</p>
                <img
                  src={`${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000'}${currentImage}`}
                  alt="Current"
                  className="w-full max-h-48 object-contain rounded-lg border border-zinc-200"
                />
              </div>
            )}
            <div className="relative mb-4">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={(e) => setImageFile(e.target.files[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full border border-zinc-200 p-3 rounded-lg bg-zinc-50 text-gray-700 flex items-center justify-between">
                <span>{imageFile ? imageFile.name : "Upload image"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
            </div>
          </>
        )}
        {taskType === "report" && (
          <input
            type="text"
            placeholder="Report name"
            {...register("reportName")}
            className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
          />
        )}
        <button type="submit" className="w-full py-3 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition font-medium shadow-sm">
          Save
        </button>
      </form>
    </div>
  );
}

export default EditTask;
