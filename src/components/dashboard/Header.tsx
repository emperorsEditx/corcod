import React from "react";
import { Bell, Search } from "lucide-react";
import styles from "./Header.module.css";

export default function Header({ user }: { user: any }) {
    return (
        <header className={styles.header}>
            <div className={styles.search}>
                <Search size={18} className={styles.searchIcon} />
                <input type="text" placeholder="Search projects, tasks..." />
            </div>

            <div className={styles.actions}>
                <button className={styles.iconBtn}>
                    <Bell size={20} />
                    <span className={styles.badge}></span>
                </button>
                <div className={styles.welcome}>
                    <span>Welcome back, <strong>{user?.name?.split(" ")[0]}</strong></span>
                </div>
            </div>
        </header>
    );
}
