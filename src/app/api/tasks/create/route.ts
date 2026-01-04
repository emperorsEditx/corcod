import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";

export async function POST(req: Request) {
    const session = await auth();

    if (!session || (session.user.role !== "admin" && session.user.role !== "project_manager")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();
        await connectDB();

        const task = await Task.create(data);
        const populatedTask = await Task.findById(task._id)
            .populate("project")
            .populate("assignedTo");

        return NextResponse.json(populatedTask, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
