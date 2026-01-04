import React from "react";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Task from "@/models/Task";
import Invoice from "@/models/Invoice";
import User from "@/models/User";
import {
    Briefcase,
    CheckSquare,
    Users,
    TrendingUp,
    Clock,
    ArrowRight
} from "lucide-react";
import styles from "./dashboard.module.css";
import Link from "next/link";
import { auth } from "@/auth";

async function getStats(user: any) {
    await connectDB();

    let projectFilter = {};
    let taskFilter = { status: { $ne: "completed" } };
    let revenueFilter = { status: "paid" };

    if (user.role === "developer") {
        taskFilter = { ...taskFilter, assignedTo: user.id } as any;
        // Developers only see counts for their tasks
    } else if (user.role === "project_manager") {
        const managedProjects = await Project.find({ manager: user.id }).select("_id");
        const projectIds = managedProjects.map(p => p._id);
        projectFilter = { _id: { $in: projectIds } };
        taskFilter = { ...taskFilter, project: { $in: projectIds } } as any;
    }

    const [projectCount, taskCount, userCount, totalRevenue] = await Promise.all([
        Project.countDocuments(projectFilter),
        Task.countDocuments(taskFilter),
        User.countDocuments(user.role === "admin" ? {} : { status: "active" }),
        Invoice.aggregate([
            { $match: revenueFilter },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])
    ]);

    return {
        projects: projectCount,
        tasks: taskCount,
        users: userCount,
        revenue: totalRevenue[0]?.total || 0
    };
}

export default async function DashboardPage() {
    const session = await auth();
    if (!session || !session.user) return null;

    const stats = await getStats(session.user);

    const cards: { label: string; value: string | number; icon: any; color: string }[] = [
        { label: "Active Projects", value: stats.projects, icon: Briefcase, color: "#6366f1" },
        { label: "Pending Tasks", value: stats.tasks, icon: CheckSquare, color: "#10b981" },
        { label: "Team Members", value: stats.users, icon: Users, color: "#f59e0b" },
    ];

    if (session.user.role === "admin") {
        cards.push({ label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "#ec4899" });
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Dashboard Overview</h1>
                <p>Monitor your software house performance and project status.</p>
            </div>

            <div className={styles.stats}>
                {cards.map((card, i) => (
                    <div key={i} className={`${styles.statCard} glass animate-fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{card.label}</span>
                            <h3 className={styles.statValue}>{card.value}</h3>
                        </div>
                        <div className={styles.statIcon} style={{ background: `${card.color}20`, color: card.color }}>
                            <card.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.grid}>
                <div className={`${styles.mainCard} glass`}>
                    <div className={styles.cardHeader}>
                        <h3>Recent Projects</h3>
                        <Link href="/dashboard/projects" className={styles.viewAll}>
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className={styles.emptyState}>
                        <Clock size={40} />
                        <p>No recent projects found. Start by creating a new project.</p>
                        <Link href="/dashboard/projects/new" className={styles.btn}>Create Project</Link>
                    </div>
                </div>

                <div className={`${styles.sideCard} glass`}>
                    <div className={styles.cardHeader}>
                        <h3>Upcoming Tasks</h3>
                    </div>
                    <div className={styles.emptyState}>
                        <p>No upcoming tasks for now.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
