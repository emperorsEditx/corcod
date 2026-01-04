import React from "react";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import Project from "@/models/Project";
import User from "@/models/User";
import { auth } from "@/auth";
import styles from "./tasks.module.css";
import TaskList from "./TaskList";

async function getData(session: any) {
    await connectDB();

    let query = {};
    if (session?.user?.role === "developer") {
        query = { assignedTo: session.user.id };
    } else if (session?.user?.role === "project_manager") {
        // Find projects where this PM is assigned
        const managedProjects = await Project.find({ manager: session.user.id }).select("_id");
        query = { project: { $in: managedProjects.map(p => p._id) } };
    }

    const tasks = await Task.find(query)
        .populate("project")
        .populate("assignedTo")
        .sort({ updatedAt: -1 });

    const projects = await Project.find({});
    const users = await User.find({ status: "active" });

    return {
        tasks: JSON.parse(JSON.stringify(tasks)),
        projects: JSON.parse(JSON.stringify(projects)),
        users: JSON.parse(JSON.stringify(users)),
    };
}

export default async function TasksPage() {
    const session = await auth();
    if (!session || !session.user) return null;

    const { tasks, projects, users } = await getData(session);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Tasks</h1>
                    <p>Manage and track your daily activities.</p>
                </div>
                {session.user.role !== "developer" && (
                    <div id="task-trigger-placeholder"></div>
                )}
            </div>

            <TaskList
                initialTasks={tasks}
                projects={projects}
                users={users}
                userRole={session.user.role}
            />
        </div>
    );
}
