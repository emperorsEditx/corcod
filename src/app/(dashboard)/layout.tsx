import React from "react";
import { Sidebar, Header } from "@/components/dashboard";
import styles from "./layout.module.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className={styles.container}>
            <Sidebar user={session.user} />
            <div className={styles.main}>
                <Header user={session.user} />
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}
