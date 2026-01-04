import React from "react";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import Project from "@/models/Project";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import styles from "./invoices.module.css";
import InvoiceList from "./InvoiceList";

async function getData() {
    await connectDB();
    const invoices = await Invoice.find({}).populate("project").sort({ createdAt: -1 });
    const projects = await Project.find({});
    return {
        invoices: JSON.parse(JSON.stringify(invoices)),
        projects: JSON.parse(JSON.stringify(projects)),
    };
}

export default async function InvoicesPage() {
    const session = await auth();

    // Only Admin can manage invoices in this ERP version
    if (session?.user?.role !== "admin") {
        redirect("/dashboard");
    }

    const { invoices, projects } = await getData();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Invoices</h1>
                    <p>Generate and manage client billing.</p>
                </div>
            </div>

            <InvoiceList initialInvoices={invoices} projects={projects} />
        </div>
    );
}
