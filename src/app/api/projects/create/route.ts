import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function POST(req: Request) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();
        await connectDB();

        const project = await Project.create(data);
        const populatedProject = await Project.findById(project._id).populate("manager");

        return NextResponse.json(populatedProject, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
