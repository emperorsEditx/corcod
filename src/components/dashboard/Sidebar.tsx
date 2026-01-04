"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    CheckSquare,
    Users,
    FileText,
    Settings,
    LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";
import styles from "./Sidebar.module.css";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Briefcase, label: "Projects", href: "/dashboard/projects" },
    { icon: CheckSquare, label: "Tasks", href: "/dashboard/tasks" },
    { icon: Users, label: "Users", href: "/dashboard/users" },
    { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
];

export default function Sidebar({ user }: { user: any }) {
    const pathname = usePathname();

    return (
        <div className={`${styles.sidebar} glass`}>
            <div className={styles.logo}>
                <h2 className="gradient-text">CorCod</h2>
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <div className={styles.user}>
                    <div className={styles.avatar}>
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>{user?.name}</p>
                        <p className={styles.userRole}>{user?.role || "Team Member"}</p>
                    </div>
                </div>
                <button className={styles.logoutBtn} onClick={() => signOut()}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
