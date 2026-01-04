"use client";

import React, { useState } from "react";
import styles from "./tasks.module.css";
import { Clock, User, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function TaskList({
    initialTasks,
    projects,
    users,
    userRole
}: {
    initialTasks: any[],
    projects: any[],
    users: any[],
    userRole: string
}) {
    const [tasks, setTasks] = useState(initialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        project: projects[0]?._id || "",
        assignedTo: users[0]?._id || "",
        priority: "medium",
        deadline: ""
    });

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/tasks/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const newTask = await res.json();
                setTasks([newTask, ...tasks]);
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {userRole !== "developer" && (
                <div className={styles.topActions}>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Create Task
                    </Button>
                </div>
            )}

            <div className={styles.taskList}>
                {tasks.map((task) => (
                    <div key={task._id} className={`${styles.taskCard} glass`}>
                        <div className={styles.taskMain}>
                            <span className={styles.projectName}>{task.project?.name}</span>
                            <h3>{task.title}</h3>
                            <div className={styles.taskMeta}>
                                <div className={styles.metaItem}>
                                    <Clock size={14} />
                                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <User size={14} />
                                    <span>{task.assignedTo?.name || "Unassigned"}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <div className={`${styles.priority} ${styles[task.priority]}`}></div>
                                    <span style={{ textTransform: 'capitalize' }}>{task.priority}</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.taskStatus}>
                            <span className={`${styles.status} ${styles[task.status]}`}>
                                {task.status.replace("_", " ")}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Task"
            >
                <form onSubmit={handleCreateTask} className={styles.createForm}>
                    <Input
                        label="Task Title"
                        placeholder="Implement login flow"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                    <div className={styles.field}>
                        <label>Description</label>
                        <textarea
                            className={styles.select}
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Project</label>
                        <select
                            className={styles.select}
                            value={formData.project}
                            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                        >
                            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label>Assign To</label>
                        <select
                            className={styles.select}
                            value={formData.assignedTo}
                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        >
                            <option value="">Unassigned</option>
                            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label>Priority</label>
                        <select
                            className={styles.select}
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <Button type="submit" isLoading={loading}>Create Task</Button>
                </form>
            </Modal>
        </>
    );
}
