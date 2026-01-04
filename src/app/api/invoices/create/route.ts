import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function POST(req: Request) {
    const session = await auth();

    if (session?.user?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();
        await connectDB();

        const invoice = await Invoice.create(data);
        const populatedInvoice = await Invoice.findById(invoice._id).populate("project");

        return NextResponse.json(populatedInvoice, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
