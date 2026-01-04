import React from "react";
import Link from "next/link";
import { Plus, Briefcase, Calendar, User } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import styles from "./projects.module.css";

async function getProjects() {
    await connectDB();
    return Project.find().sort({ createdAt: -1 });
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Projects</h1>
                    <p>Manage and track all software development projects.</p>
                </div>
                <Link href="/dashboard/projects/new" className={styles.addBtn}>
                    <Plus size={20} />
                    <span>New Project</span>
                </Link>
            </div>

            <div className={styles.grid}>
                {projects.length === 0 ? (
                    <div className={`${styles.empty} glass`}>
                        <Briefcase size={40} />
                        <p>No projects found. Create your first project to get started.</p>
                    </div>
                ) : (
                    projects.map((project: any) => (
                        <Link href={`/dashboard/projects/${project._id}`} key={project._id} className={`${styles.projectCard} glass`}>
                            <div className={styles.cardTop}>
                                <span className={`${styles.status} ${styles[project.status]}`}>{project.status}</span>
                                <h3 className={styles.projectName}>{project.name}</h3>
                            </div>
                            <p className={styles.description}>{project.description}</p>
                            <div className={styles.meta}>
                                <div className={styles.metaItem}>
                                    <User size={14} />
                                    <span>{project.clientName}</span>
                                </div>
                                <div className={styles.metaItem}>
                                    <Calendar size={14} />
                                    <span>{project.startDate ? new Date(project.startDate).toLocaleDateString() : "TBA"}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
