import React from "react";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import styles from "./users.module.css";
import UserList from "./UserList";

async function getUsers() {
    await connectDB();
    return await User.find({}).sort({ createdAt: -1 });
}

export default async function UsersPage() {
    const session = await auth();

    // Only Admin can see this page
    if (session?.user?.role !== "admin") {
        redirect("/dashboard");
    }

    const initialUsers = await getUsers();

    // Convert Mongoose objects to plain JS objects for the client
    const users = JSON.parse(JSON.stringify(initialUsers));

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>User Management</h1>
                    <p>Approve new users and manage permissions.</p>
                </div>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                    Add New User
                </button>
            </div>

            <UserList users={users} />
        </div>
    );
}
