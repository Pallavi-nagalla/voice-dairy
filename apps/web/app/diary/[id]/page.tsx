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
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const gradient = moodGradients[entry.mood] || moodGradients.calm;
  const paragraphs = (entry.refinedEntry || "").split("\n").filter(Boolean);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient}`}>
      <button
        onClick={() => router.back()}
        className="fixed top-5 left-5 text-white/60 hover:text-white text-sm transition z-10"
      >
        ← Back
      </button>

      <div className="max-w-xl mx-auto px-6 py-24 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/60 text-sm mb-3 text-center"
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
          className="text-3xl md:text-4xl font-bold text-white text-center mb-6 leading-tight"
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
                className="text-xs px-3 py-1 rounded-full bg-white/20 text-white"
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
          className="w-16 h-px bg-white/40 mb-8"
        />

        <div className="space-y-5 text-white/90 leading-relaxed text-base w-full">
          {paragraphs.map((para: string, i: number) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-14 w-full"
        >
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="text-white/40 text-xs hover:text-white/70 transition"
          >
            {showRaw ? "Hide" : "Show"} raw transcript
          </button>
          {showRaw && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-white/40 text-xs leading-relaxed italic border-l-2 border-white/20 pl-3"
            >
              {entry.rawTranscript}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
