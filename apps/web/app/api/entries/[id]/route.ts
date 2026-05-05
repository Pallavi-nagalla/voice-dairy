import { NextRequest, NextResponse } from "next/server";
import { connectDB, Entry } from "@voice-diary/db";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const entry = await Entry.findById(params.id);
  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(JSON.parse(JSON.stringify(entry)));
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  await Entry.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
