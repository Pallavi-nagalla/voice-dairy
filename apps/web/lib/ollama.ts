const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

export async function refineWithOllama(rawTranscript: string) {
  const prompt = `You are a personal diary AI. The user spoke this raw diary entry:

"${rawTranscript}"

Rewrite it as a beautiful, emotionally resonant diary entry preserving the user's feelings and tone.

You MUST respond with ONLY a JSON object. No markdown. No backticks. No explanation. Just raw JSON.

{
  "title": "short evocative title max 8 words",
  "refinedEntry": "full rewritten entry in 2-4 paragraphs separated by newlines",
  "summary": "one sentence summary",
  "mood": "one of: happy sad nostalgic anxious excited calm angry",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
    });

    const data = await res.json();
    const text = (data.response || "").trim();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error("No JSON found in response");
  } catch (error: any) {
    return {
      title: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
      }),
      refinedEntry: rawTranscript,
      summary: rawTranscript.slice(0, 120),
      mood: "calm",
      tags: [],
    };
  }
}
