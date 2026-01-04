import React from "react";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { UserPlus, Mail, Shield } from "lucide-react";
import styles from "./users.module.css";

async function getUsers() {
    await connectDB();
    return User.find().sort({ createdAt: -1 });
}

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Team Members</h1>
                    <p>Manage your software house staff and their roles.</p>
                </div>
            </div>

            <div className={styles.grid}>
                {users.map((user: any) => (
                    <div key={user._id} className={`${styles.userCard} glass`}>
                        <div className={styles.avatar}>
                            {user.name.charAt(0)}
                        </div>
                        <div className={styles.userInfo}>
                            <h3>{user.name}</h3>
                            <div className={styles.details}>
                                <div className={styles.detail}>
                                    <Mail size={14} />
                                    <span>{user.email}</span>
                                </div>
                                <div className={styles.detail}>
                                    <Shield size={14} />
                                    <span className={styles.role}>{user.role}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
