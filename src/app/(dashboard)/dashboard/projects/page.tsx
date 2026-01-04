import React from "react";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { auth } from "@/auth";
import styles from "./projects.module.css";
import ProjectList from "@/app/(dashboard)/dashboard/projects/ProjectList";

async function getData(session: any) {
    await connectDB();

    let query = {};
    if (session?.user?.role === "client") {
        query = { clientName: session.user.name };
    } else if (session?.user?.role === "project_manager") {
        query = { manager: session.user.id };
    }
    // Admin sees all

    const projects = await Project.find(query).populate("manager").sort({ createdAt: -1 });
    const managers = await User.find({ role: { $in: ["admin", "project_manager"] }, status: "active" });

    return {
        projects: JSON.parse(JSON.stringify(projects)),
        managers: JSON.parse(JSON.stringify(managers)),
    };
}

export default async function ProjectsPage() {
    const session = await auth();
    if (!session || !session.user) return null;

    const { projects, managers } = await getData(session);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Projects</h1>
                    <p>Track and manage your software house projects.</p>
                </div>
            </div>

            <ProjectList
                initialProjects={projects}
                managers={managers}
                userRole={session.user.role}
            />
        </div>
    );
}
