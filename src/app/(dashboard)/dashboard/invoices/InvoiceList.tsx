"use client";

import React, { useState } from "react";
import styles from "./invoices.module.css";
import { FileText, Plus, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

export default function InvoiceList({ initialInvoices, projects }: { initialInvoices: any[], projects: any[] }) {
    const [invoices, setInvoices] = useState(initialInvoices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        project: projects[0]?._id || "",
        clientName: "",
        dueDate: "",
        items: [{ description: "", amount: 0 }]
    });

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: "", amount: 0 }]
        });
    };

    const handleRemoveItem = (index: number) => {
        if (formData.items.length === 1) return;
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = formData.items.map((item, i) => {
            if (i === index) return { ...item, [field]: value };
            return item;
        });
        setFormData({ ...formData, items: newItems });
    };

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const totalAmount = formData.items.reduce((sum, item) => sum + Number(item.amount), 0);

        try {
            const res = await fetch("/api/invoices/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, amount: totalAmount }),
            });
            if (res.ok) {
                const newInvoice = await res.json();
                setInvoices([newInvoice, ...invoices]);
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.topActions} style={{ marginBottom: '2rem' }}>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Generate Invoice
                </Button>
            </div>

            <div className={styles.invoiceGrid}>
                {invoices.map((inv) => (
                    <div key={inv._id} className={`${styles.invoiceCard} glass`}>
                        <div className={styles.invoiceHeader}>
                            <div className={styles.meta}>
                                <span className={styles.number}>{inv.invoiceNumber}</span>
                                <h4 className={styles.clientName}>{inv.clientName}</h4>
                                <span className={styles.projectName}>{inv.project?.name}</span>
                            </div>
                            <span className={`${styles.status} ${styles[inv.status]}`}>
                                {inv.status}
                            </span>
                        </div>

                        <div className={styles.amount}>
                            ${inv.amount.toLocaleString()}
                        </div>

                        <div className={styles.actions} style={{ marginTop: 'auto' }}>
                            <Button className={styles.btn} style={{ width: '100%' }}>
                                <Download size={16} /> Download PDF
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Generate New Invoice"
            >
                <form onSubmit={handleCreateInvoice} className={styles.createForm}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Invoice #"
                            value={formData.invoiceNumber}
                            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                            required
                        />
                        <Input
                            label="Due Date"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Project</label>
                        <select
                            className={styles.select}
                            value={formData.project}
                            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                            required
                        >
                            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </div>

                    <Input
                        label="Client Name"
                        placeholder="Acme Corp"
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        required
                    />

                    <div className={styles.itemList}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Items</label>
                        {formData.items.map((item, index) => (
                            <div key={index} className={styles.itemRow}>
                                <input
                                    placeholder="Service description"
                                    className={styles.select}
                                    style={{ padding: '0.5rem' }}
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    className={styles.select}
                                    style={{ padding: '0.5rem' }}
                                    value={item.amount}
                                    onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                                    required
                                />
                                <button type="button" className={styles.removeBtn} onClick={() => handleRemoveItem(index)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <Button type="button" onClick={handleAddItem} className={styles.addBtn}>
                            + Add Item
                        </Button>
                    </div>

                    <Button type="submit" isLoading={loading}>Generate Invoice</Button>
                </form>
            </Modal>
        </>
    );
}
