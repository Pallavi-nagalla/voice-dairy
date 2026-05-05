"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const moodEmoji: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  nostalgic: "🌅",
  anxious: "😰",
  excited: "🎉",
  calm: "😌",
  angry: "😤",
};

const moodBg: Record<string, string> = {
  happy: "from-yellow-400/10 to-orange-400/10 border-yellow-400/20",
  sad: "from-blue-600/10 to-indigo-800/10 border-blue-500/20",
  nostalgic: "from-amber-500/10 to-rose-500/10 border-amber-400/20",
  anxious: "from-purple-600/10 to-pink-600/10 border-purple-400/20",
  excited: "from-green-400/10 to-cyan-400/10 border-green-400/20",
  calm: "from-sky-400/10 to-teal-500/10 border-sky-400/20",
  angry: "from-red-600/10 to-orange-700/10 border-red-400/20",
};

export default function DiaryPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/entries")
      .then((r) => r.json())
      .then((data) => {
        setEntries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen px-4 py-12 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📖 My Diary</h1>
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white transition"
        >
          + New Entry
        </Link>
      </div>

      {loading && (
        <p className="text-gray-500 text-center mt-20">Loading entries...</p>
      )}

      {!loading && entries.length === 0 && (
        <p className="text-gray-600 text-center mt-20">
          No entries yet. Go record your first one!
        </p>
      )}

      <div className="flex flex-col gap-4">
        {entries.map((entry, i) => (
          <motion.div
            key={entry._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={`/diary/${entry._id}`}>
              <div
                className={`rounded-2xl p-5 bg-gradient-to-br ${
                  moodBg[entry.mood] || moodBg.calm
                } border hover:border-white/30 transition cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500">
                    {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xl">
                    {moodEmoji[entry.mood] || "📝"}
                  </span>
                </div>
                <h2 className="font-semibold text-lg mb-1">{entry.title}</h2>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {entry.summary}
                </p>
                {entry.tags?.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {entry.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
