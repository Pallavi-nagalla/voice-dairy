import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { connectDB, Entry } = require("@voice-diary/db");
    await connectDB();
    const entries = await Entry.find().sort({ createdAt: -1 });
    // force-serialize ObjectId and Date fields properly
    return NextResponse.json(JSON.parse(JSON.stringify(entries)));
  } catch (error: any) {
    console.error("[GET /api/entries]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { connectDB, Entry } = require("@voice-diary/db");
    await connectDB();
    const body = await req.json();
    const entry = await Entry.create(body);
    return NextResponse.json(JSON.parse(JSON.stringify(entry)), {
      status: 201,
    });
  } catch (error: any) {
    console.error("[POST /api/entries]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
