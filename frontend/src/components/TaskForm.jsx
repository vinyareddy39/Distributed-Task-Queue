import { useState, useRef } from "react";

import api from "../services/api";

function TaskForm({ fetchTasks }) {
  const [taskType, setTaskType] = useState("email");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setError("");
    } else {
      setFileName("");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    // Email validation for email task
    if (taskType === "email") {
      if (!value.trim()) {
        setError("Please enter a valid email");
        return;
      }
      const emailRegex = /^[^\s@]+@(gmail\.com|anurag\.edu\.in)$/i;
      if (!emailRegex.test(value)) {
        setError("Please enter a valid @gmail.com or @anurag.edu.in email");
        return;
      }
    }

    // Image validation
    let selectedFile = null;
    if (taskType === "image") {
      selectedFile = fileInputRef.current?.files[0];
      if (!selectedFile) {
        setError("Please select an image");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");

      if (taskType === "image") {
        // Use FormData for image upload
        const formData = new FormData();
        formData.append("taskType", "image");
        formData.append("image", selectedFile);

        await api.post("/task", formData, {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        let data = {};

        if (taskType === "email") {
          data.email = value;
        } else if (taskType === "report") {
          data.reportName = value;
        }

        await api.post(
          "/task",
          {
            taskType,
            data,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      }

      // Reset form fields
      setValue("");
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Refresh tasks
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={submitHandler} className="bg-white p-5 rounded-xl shadow-md mb-6">
      <select
        value={taskType}
        onChange={(e) => {
          setTaskType(e.target.value);
          setError("");
          setValue("");
          setFileName("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }}
        className="w-full border p-3 rounded-lg mb-4"
      >
        <option value="email">Email</option>
        <option value="image">Image</option>
        <option value="report">Report</option>
      </select>

      {taskType === "email" && (
        <>
          <input
            type="email"
            placeholder="Enter Email"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
        </>
      )}
      {taskType === "image" && (
        <>
          <div className="relative mb-4">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-full border p-3 rounded-lg bg-white text-gray-700 flex items-center justify-between">
              <span>{fileName ? fileName : "Upload image"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
          </div>
          {error && <p className="text-red-500 mb-2">{error}</p>}
        </>
      )}
      {taskType === "report" && (
        <input
          type="text"
          placeholder="Enter report name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />
      )}

      <button type="submit" className="bg-blue-500 text-white px-5 py-3 rounded-lg">
        Create Task
      </button>
    </form>
  );
}

export default TaskForm;