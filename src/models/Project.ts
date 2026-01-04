import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    clientName: { type: String, required: true },
    manager: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["planning", "active", "completed", "on_hold"],
      default: "planning",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: { type: Number },
  },
  { timestamps: true }
);

const Project = models.Project || model("Project", ProjectSchema);

export default Project;
