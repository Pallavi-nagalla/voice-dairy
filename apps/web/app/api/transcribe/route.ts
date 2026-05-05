import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audio = formData.get("audio") as File;
  if (!audio)
    return NextResponse.json({ error: "No audio file" }, { status: 400 });

  const sttForm = new FormData();
  sttForm.append("audio", audio);

  const res = await fetch(
    `${process.env.STT_URL || "http://localhost:8000"}/transcribe`,
    { method: "POST", body: sttForm },
  );

  const data = await res.json();
  return NextResponse.json(data);
}
