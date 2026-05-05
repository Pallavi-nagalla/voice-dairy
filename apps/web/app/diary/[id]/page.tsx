"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const moodGradients: Record<string, string> = {
  happy: "from-yellow-400 via-orange-400 to-pink-400",
  sad: "from-slate-700 via-blue-800 to-indigo-900",
  nostalgic: "from-amber-600 via-rose-500 to-pink-600",
  anxious: "from-violet-700 via-purple-600 to-pink-600",
  excited: "from-green-400 via-cyan-400 to-sky-500",
  calm: "from-sky-500 via-teal-500 to-emerald-500",
  angry: "from-red-700 via-orange-600 to-yellow-500",
};

const moodEmoji: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  nostalgic: "🌅",
  anxious: "😰",
  excited: "🎉",
  calm: "😌",
  angry: "😤",
};

export default function StoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<any>(null);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    fetch(`/api/entries/${id}`)
      .then((r) => r.json())
      .then(setEntry);
  }, [id]);

  if (!entry)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #faf8f3 0%, #f5f0e8 100%)",
        }}
      >
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#d4af37", borderTopColor: "transparent" }}
        />
      </div>
    );

  const paragraphs = (entry.refinedEntry || "").split("\n").filter(Boolean);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #faf8f3 0%, #f5f0e8 100%)",
      }}
    >
      <button
        onClick={() => router.back()}
        className="fixed top-5 left-5 text-sm transition z-10 px-3 py-1 rounded"
        style={{ color: "#8b7355", textDecoration: "underline" }}
      >
        ← Back
      </button>

      <div
        className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-24"
        style={{
          background:
            "linear-gradient(to right, rgba(250, 248, 243, 0.5) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(245, 240, 232, 0.5) 100%)",
          boxShadow:
            "inset -1px 0 0 rgba(0, 0, 0, 0.05), inset 1px 0 0 rgba(255, 255, 255, 0.5)",
          minHeight: "calc(100vh - 2rem)",
          marginTop: "2rem",
          marginBottom: "2rem",
          borderRadius: "2px",
        }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm mb-6 text-center uppercase tracking-widest"
          style={{ color: "#8b7355", fontFamily: "'Crimson Text', serif" }}
        >
          {new Date(entry.createdAt).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {moodEmoji[entry.mood]} {entry.mood}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-center mb-8 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: "#3d3d3d" }}
        >
          {entry.title}
        </motion.h1>

        {entry.tags?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 flex-wrap justify-center mb-8"
          >
            {entry.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(212, 175, 55, 0.2)",
                  color: "#8b7355",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.25 }}
          className="h-px mb-12"
          style={{
            background:
              "linear-gradient(to right, transparent, #d4af37 50%, transparent)",
          }}
        />

        <div
          className="space-y-6"
          style={{
            color: "#3d3d3d",
            fontFamily: "'Crimson Text', serif",
            fontSize: "18px",
            lineHeight: "1.9",
          }}
        >
          {paragraphs.map((para: string, i: number) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="indent-8 first:indent-0"
            >
              {para}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 pt-8 border-t"
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="text-sm transition"
            style={{ color: "#8b7355", textDecoration: "underline" }}
          >
            {showRaw ? "Hide" : "Show"} raw transcript
          </button>
          {showRaw && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm leading-relaxed italic p-4 rounded"
              style={{
                background: "rgba(212, 175, 55, 0.1)",
                color: "#5d5d5d",
                fontFamily: "'Crimson Text', serif",
                borderLeft: "3px solid #d4af37",
                paddingLeft: "16px",
              }}
            >
              {entry.rawTranscript}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
