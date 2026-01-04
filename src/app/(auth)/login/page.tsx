"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import styles from "./login.module.css";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                if (result.error.includes("ACCOUNT_PENDING")) {
                    setError("Your account is pending approval by an administrator.");
                } else if (result.error.includes("ACCOUNT_INACTIVE")) {
                    setError("Your account has been deactivated.");
                } else {
                    setError("Invalid email or password");
                }
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.card} glass animate-fade-in`}>
                <div className={styles.header}>
                    <h1 className="gradient-text">CorCod ERP</h1>
                    <p>Login to manage your software house</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="name@corcod.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" isLoading={loading} className={styles.submitBtn}>
                        Sign In
                    </Button>
                </form>

                <div className={styles.footer}>
                    Contact your administrator for access.
                </div>
            </div>
        </div>
    );
}
