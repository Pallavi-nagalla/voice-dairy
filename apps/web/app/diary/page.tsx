"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <main
      className="min-h-screen px-4 py-12 max-w-4xl mx-auto"
      style={{
        background: "linear-gradient(135deg, #faf8f3 0%, #f5f0e8 100%)",
      }}
    >
      <div className="flex justify-between items-center mb-12">
        <h1
          className="text-5xl font-bold"
          style={{ fontFamily: "'Playfair Display', serif", color: "#3d3d3d" }}
        >
          My Diary
        </h1>
        <Link
          href="/"
          className="text-sm transition px-4 py-2 rounded-lg"
          style={{
            background: "#d4af37",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          + New Entry
        </Link>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="h-px mb-12"
        style={{
          background:
            "linear-gradient(to right, transparent, #d4af37 50%, transparent)",
        }}
      />

      {loading && (
        <p
          className="text-center mt-20"
          style={{
            color: "#8b7355",
            fontFamily: "'Crimson Text', serif",
            fontSize: "18px",
          }}
        >
          Loading your entries...
        </p>
      )}

      {!loading && entries.length === 0 && (
        <p
          className="text-center mt-20"
          style={{
            color: "#8b7355",
            fontFamily: "'Crimson Text', serif",
            fontSize: "18px",
          }}
        >
          Your diary awaits. Record your first entry.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.map((entry, i) => (
          <motion.div
            key={entry._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/diary/${entry._id}`}>
              <div
                className="rounded-lg p-6 transition transform hover:shadow-lg cursor-pointer h-full flex flex-col"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(245, 240, 232, 0.8) 100%)",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs" style={{ color: "#8b7355" }}>
                    {new Date(entry.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#8b7355" }}
                  >
                    {entry.mood}
                  </span>
                </div>
                <h2
                  className="font-bold text-lg mb-2"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#3d3d3d",
                  }}
                >
                  {entry.title}
                </h2>
                <p
                  className="text-sm leading-relaxed line-clamp-3 flex-grow"
                  style={{
                    color: "#5d5d5d",
                    fontFamily: "'Crimson Text', serif",
                  }}
                >
                  {entry.summary}
                </p>
                {entry.tags?.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {entry.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          background: "rgba(212, 175, 55, 0.2)",
                          color: "#8b7355",
                        }}
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
