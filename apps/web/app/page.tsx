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
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <Link
        href="/diary"
        className="absolute top-6 right-6 text-sm text-gray-400 hover:text-white transition"
      >
        My Entries →
      </Link>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-2 tracking-tight"
      >
        🎙️ Voice Diary
      </motion.h1>
      <p className="text-gray-500 text-sm mb-12">
        Speak your mind. AI does the rest.
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
            className="w-32 h-32 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center text-5xl shadow-2xl shadow-red-500/40 transition-colors"
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
            className="w-32 h-32 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-5xl shadow-xl border-2 border-red-500 animate-pulse transition"
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
            <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">
              {status === "transcribing" && "Transcribing your voice..."}
              {status === "refining" && "Ollama is refining your entry..."}
              {status === "saving" && "Saving to diary..."}
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
              className={`rounded-2xl p-6 bg-gradient-to-br ${
                moodGradients[refined.mood] || moodGradients.calm
              } text-white shadow-2xl`}
            >
              <p className="text-xs uppercase tracking-widest opacity-70 mb-1">
                {refined.mood} · {refined.tags?.join(", ")}
              </p>
              <h2 className="text-2xl font-bold mb-3">{refined.title}</h2>
              <p className="text-sm leading-relaxed opacity-90 line-clamp-4">
                {refined.refinedEntry}
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setStatus("idle");
                  setRefined(null);
                }}
                className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm transition"
              >
                Record Another
              </button>
              <Link
                href="/diary"
                className="flex-1 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm text-center hover:bg-gray-100 transition"
              >
                View All Entries
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
