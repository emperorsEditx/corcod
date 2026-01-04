import React from "react";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import { Plus, Receipt, Download, MoreVertical } from "lucide-react";
import styles from "./invoices.module.css";
import Link from "next/link";

async function getInvoices() {
    await connectDB();
    return Invoice.find().populate("project").sort({ createdAt: -1 });
}

export default async function InvoicesPage() {
    const invoices = await getInvoices();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Invoices</h1>
                    <p>Track payments and billing for all projects.</p>
                </div>
                <Link href="/dashboard/invoices/new" className={styles.addBtn}>
                    <Plus size={20} />
                    <span>Generate Invoice</span>
                </Link>
            </div>

            <div className={`${styles.tableWrapper} glass`}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Invoice #</th>
                            <th>Project</th>
                            <th>Client</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={styles.empty}>No invoices generated yet.</td>
                            </tr>
                        ) : (
                            invoices.map((invoice: any) => (
                                <tr key={invoice._id}>
                                    <td><strong>{invoice.invoiceNumber}</strong></td>
                                    <td>{invoice.project?.name}</td>
                                    <td>{invoice.clientName}</td>
                                    <td>${invoice.amount.toLocaleString()}</td>
                                    <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles[invoice.status]}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className={styles.actionBtn}>
                                            <Download size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
