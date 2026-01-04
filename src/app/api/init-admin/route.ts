import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();
        const userCount = await User.countDocuments();
        
        if (userCount > 0) {
            return NextResponse.json({ error: "Admin already initialized" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash("admin123", 12);
        await User.create({
            name: "Super Admin",
            email: "admin@corcod.com",
            password: hashedPassword,
            role: "admin",
            status: "active",
            permissions: ["all"]
        });

        return NextResponse.json({ 
            message: "Admin created successfully", 
            email: "admin@corcod.com",
            password: "admin123" 
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
