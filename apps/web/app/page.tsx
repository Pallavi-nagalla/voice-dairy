"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Status =
  | "idle"
  | "recording"
  | "transcribing"
  | "refining"
  | "saving"
  | "done";

const moodGradients: Record<string, string> = {
  happy: "from-yellow-400 to-orange-400",
  sad: "from-blue-600 to-indigo-800",
  nostalgic: "from-amber-500 to-rose-500",
  anxious: "from-purple-600 to-pink-600",
  excited: "from-green-400 to-cyan-400",
  calm: "from-sky-400 to-teal-500",
  angry: "from-red-600 to-orange-700",
};

export default function HomePage() {
  const [status, setStatus] = useState<Status>("idle");
  const [refined, setRefined] = useState<any>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    chunksRef.current = [];
    mr.ondataavailable = (e) => chunksRef.current.push(e.data);
    mr.onstop = handleStop;
    mr.start();
    mediaRef.current = mr;
    setStatus("recording");
  };

  const stopRecording = () => mediaRef.current?.stop();

  const handleStop = async () => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });

    setStatus("transcribing");
    const form = new FormData();
    form.append("audio", blob, "recording.webm");
    const tRes = await fetch("/api/transcribe", { method: "POST", body: form });
    const { transcript } = await tRes.json();

    setStatus("refining");
    const rRes = await fetch("/api/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });
    const refined = await rRes.json();
    setRefined(refined);

    setStatus("saving");
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawTranscript: transcript, ...refined }),
    });

    setStatus("done");
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      style={{
        background: "linear-gradient(135deg, #faf8f3 0%, #f5f0e8 100%)",
      }}
    >
      <Link
        href="/diary"
        className="absolute top-6 right-6 text-sm transition"
        style={{ color: "#8b7355", textDecoration: "underline" }}
      >
        📖 My Entries
      </Link>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-bold mb-4 tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif", color: "#3d3d3d" }}
      >
        Voice Diary
      </motion.h1>
      <p
        className="text-lg mb-12"
        style={{
          color: "#8b7355",
          fontFamily: "'Crimson Text', serif",
          fontStyle: "italic",
        }}
      >
        Whisper your thoughts. The pages await.
      </p>

      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.button
            key="record"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="w-32 h-32 rounded-full flex items-center justify-center text-5xl shadow-2xl transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #d4af37 0%, #b8941f 100%)",
              boxShadow: "0 10px 30px rgba(212, 175, 55, 0.3)",
            }}
          >
            🎤
          </motion.button>
        )}

        {status === "recording" && (
          <motion.button
            key="stop"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={stopRecording}
            className="w-32 h-32 rounded-full flex items-center justify-center text-5xl shadow-xl border-2 animate-pulse transition"
            style={{
              background: "linear-gradient(135deg, #f5f0e8 0%, #e8dcc8 100%)",
              borderColor: "#d4af37",
              color: "#3d3d3d",
            }}
          >
            ⏹️
          </motion.button>
        )}

        {["transcribing", "refining", "saving"].includes(status) && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-5"
          >
            <div
              className="w-14 h-14 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#d4af37", borderTopColor: "transparent" }}
            />
            <p className="text-sm" style={{ color: "#8b7355" }}>
              {status === "transcribing" && "Transcribing your voice..."}
              {status === "refining" && "Refining your thoughts..."}
              {status === "saving" && "Preserving in pages..."}
            </p>
          </motion.div>
        )}

        {status === "done" && refined && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <div
              className="rounded-lg p-8 shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(245, 240, 232, 0.9) 100%)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
              }}
            >
              <p
                className="text-xs uppercase tracking-widest mb-2"
                style={{ color: "#8b7355", opacity: 0.7 }}
              >
                {refined.mood} · {refined.tags?.join(", ")}
              </p>
              <h2
                className="text-2xl font-bold mb-3"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#3d3d3d",
                }}
              >
                {refined.title}
              </h2>
              <p
                className="text-base leading-relaxed line-clamp-4"
                style={{
                  color: "#3d3d3d",
                  fontFamily: "'Crimson Text', serif",
                }}
              >
                {refined.refinedEntry}
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setStatus("idle");
                  setRefined(null);
                }}
                className="flex-1 py-3 rounded-lg text-sm transition"
                style={{
                  background: "#f5f0e8",
                  color: "#3d3d3d",
                  border: "1px solid #d4af37",
                }}
              >
                Record Another
              </button>
              <Link
                href="/diary"
                className="flex-1 py-3 rounded-lg font-semibold text-sm text-center transition"
                style={{
                  background: "#d4af37",
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                View All
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
