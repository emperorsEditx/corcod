import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await req.json();
    const { id: userId } = await params;

    try {
        await connectDB();
        let update = {};

        if (action === "approve") {
            update = { status: "active" };
        } else if (action === "deactivate") {
            update = { status: "inactive" };
        } else if (action === "delete") {
            await User.findByIdAndDelete(userId);
            return NextResponse.json({ message: "Deleted" });
        }

        const user = await User.findByIdAndUpdate(userId, update, { new: true });
        return NextResponse.json(user);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
