"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import styles from "../projects.module.css";
import formStyles from "./form.module.css";

export default function NewProjectPage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        clientName: "",
        startDate: "",
        endDate: "",
        budget: "",
        status: "planning",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    budget: Number(formData.budget),
                }),
            });

            if (res.ok) {
                router.push("/dashboard/projects");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Create New Project</h1>
            </div>

            <div className={`${formStyles.card} glass animate-fade-in`}>
                <form onSubmit={handleSubmit} className={formStyles.form}>
                    <div className={formStyles.row}>
                        <Input
                            label="Project Name"
                            placeholder="e.g. E-commerce Platform"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Client Name"
                            placeholder="e.g. Acme Corp"
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Description"
                        placeholder="Describe the project goals..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <div className={formStyles.row}>
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

                    <div className={formStyles.row}>
                        <Input
                            label="Budget ($)"
                            type="number"
                            placeholder="5000"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        />
                        <div className={formStyles.selectGroup}>
                            <label>Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className={formStyles.select}
                            >
                                <option value="planning">Planning</option>
                                <option value="active">Active</option>
                                <option value="on_hold">On Hold</option>
                            </select>
                        </div>
                    </div>

                    <div className={formStyles.actions}>
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Create Project</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
