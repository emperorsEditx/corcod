import React from "react";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { Plus, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import styles from "./tasks.module.css";
import Link from "next/link";

async function getTasks() {
    await connectDB();
    return Task.find().populate("project").sort({ status: 1, deadline: 1 });
}

export default async function TasksPage() {
    const tasks = await getTasks();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed": return <CheckCircle2 size={18} color="#10b981" />;
            case "in_progress": return <Clock size={18} color="#f59e0b" />;
            case "review": return <AlertCircle size={18} color="#6366f1" />;
            default: return <Circle size={18} color="#a1a1aa" />;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Tasks</h1>
                    <p>Keep track of all assignments across projects.</p>
                </div>
                <Link href="/dashboard/tasks/new" className={styles.addBtn}>
                    <Plus size={20} />
                    <span>New Task</span>
                </Link>
            </div>

            <div className={`${styles.taskList} glass`}>
                {tasks.length === 0 ? (
                    <div className={styles.empty}>No tasks assigned yet.</div>
                ) : (
                    tasks.map((task: any) => (
                        <div key={task._id} className={styles.taskItem}>
                            <div className={styles.statusIcon}>
                                {getStatusIcon(task.status)}
                            </div>
                            <div className={styles.taskInfo}>
                                <h4 className={styles.taskTitle}>{task.title}</h4>
                                <p className={styles.taskMeta}>
                                    {task.project?.name} • Due {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No date"}
                                </p>
                            </div>
                            <div className={`${styles.priority} ${styles[task.priority]}`}>
                                {task.priority}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
