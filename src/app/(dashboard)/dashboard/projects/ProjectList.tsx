"use client";

import React, { useState } from "react";
import styles from "./projects.module.css";
import { Briefcase, Plus, Calendar, DollarSign, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function ProjectList({ initialProjects, managers, userRole }: { initialProjects: any[], managers: any[], userRole: string }) {
    const [projects, setProjects] = useState(initialProjects);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        clientName: "",
        manager: managers[0]?._id || "",
        budget: 0,
        startDate: "",
        endDate: ""
    });

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/projects/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                const newProject = await res.json();
                setProjects([newProject, ...projects]);
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
            {(userRole === "admin") && (
                <div className={styles.topActions} style={{ marginBottom: '2rem' }}>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> New Project
                    </Button>
                </div>
            )}

            <div className={styles.projectGrid}>
                {projects.map((project) => (
                    <div key={project._id} className={`${styles.projectCard} glass`}>
                        <div className={styles.projectHeader}>
                            <div>
                                <span className={styles.client}>{project.clientName}</span>
                                <h3>{project.name}</h3>
                            </div>
                            <span className={`${styles.status} ${styles[project.status]}`}>
                                {project.status}
                            </span>
                        </div>

                        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{project.description}</p>

                        <div className={styles.projectStats}>
                            <div className={styles.statItem}>
                                <div className={styles.statLabel}>Budget</div>
                                <div className={styles.statValue}>${project.budget?.toLocaleString()}</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statLabel}>Manager</div>
                                <div className={styles.statValue}>{project.manager?.name || "TBA"}</div>
                            </div>
                        </div>

                        <div className={styles.actions} style={{ marginTop: 'auto' }}>
                            <Button variant="secondary" style={{ width: '100%' }}>View Details</Button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Project"
            >
                <form onSubmit={handleCreateProject} className={styles.createForm}>
                    <Input
                        label="Project Name"
                        placeholder="E-commerce App"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Client Name"
                        placeholder="Client XYZ"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        required
                    />
                    <div className={styles.field}>
                        <label>Manager</label>
                        <select
                            className={styles.select}
                            value={formData.manager}
                            onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                        >
                            {managers.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                        </select>
                    </div>
                    <Input
                        label="Budget ($)"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Start Date"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                        <Input
                            label="End Date"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                    </div>
                    <Button type="submit" isLoading={loading}>Create Project</Button>
                </form>
            </Modal>
        </>
    );
}
