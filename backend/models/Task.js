import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    taskType: {
      type: String,
      required: true,
    },

    data: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    retryCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Task = model("Task", taskSchema);

export default Task;