import { NextRequest, NextResponse } from "next/server";
import { refineWithOllama } from "@/lib/ollama";

export async function POST(req: NextRequest) {
  const { transcript } = await req.json();
  if (!transcript)
    return NextResponse.json({ error: "No transcript" }, { status: 400 });

  const refined = await refineWithOllama(transcript);
  return NextResponse.json(refined);
}
