'use client'
import React, { useState } from "react";
import styles from "./users.module.css";
import { Check, X, Shield, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function UserList({ users: initialUsers }: { users: any[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "developer"
    });
    const [loading, setLoading] = useState(false);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/users/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const newUser = await res.json();
                setUsers([newUser, ...users]);
                setIsModalOpen(false);
                setFormData({ name: "", email: "", password: "", role: "developer" });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId: string, action: string) => {
        try {
            const res = await fetch(`/api/users/${userId}/action`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });

            if (res.ok) {
                const updatedUser = await res.json();
                if (action === "delete") {
                    setUsers(users.filter(u => u._id !== userId));
                } else {
                    setUsers(users.map(u => u._id === userId ? updatedUser : u));
                }
            }
        } catch (err) {
            console.error("Failed to perform action:", err);
        }
    };

    return (
        <>
            <div className={styles.topActions}>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add New User
                </Button>
            </div>

            <div className={styles.userGrid}>
                {users.map((user) => (
                    <div key={user._id} className={`${styles.userCard} glass`}>
                        <div className={styles.userInfo}>
                            <div className={styles.avatar}>
                                {user.name.charAt(0)}
                            </div>
                            <div className={styles.meta}>
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <div className={styles.badges}>
                            <span className={`${styles.badge} ${styles.badgeRole}`}>
                                {user.role.replace("_", " ")}
                            </span>
                            <span className={`${styles.badge} ${styles.badgeStatus} ${styles[user.status]}`}>
                                {user.status}
                            </span>
                        </div>

                        <div className={styles.actions}>
                            {user.status === "pending" && (
                                <button
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    onClick={() => handleAction(user._id, "approve")}
                                >
                                    <Check size={16} /> Approve
                                </button>
                            )}
                            {user.status === "active" && (
                                <button
                                    className={styles.btn}
                                    onClick={() => handleAction(user._id, "deactivate")}
                                >
                                    <X size={16} /> Deactivate
                                </button>
                            )}
                            <button className={styles.btn}>
                                <Shield size={16} /> Perms
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New User"
            >
                <form onSubmit={handleCreateUser} className={styles.createForm}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@corcod.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <div className={styles.field}>
                        <label>Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className={styles.select}
                        >
                            <option value="developer">Developer</option>
                            <option value="project_manager">Project Manager</option>
                            <option value="admin">Admin</option>
                            <option value="client">Client</option>
                        </select>
                    </div>
                    <Button type="submit" isLoading={loading}>Create User</Button>
                </form>
            </Modal>
        </>
    );
}
