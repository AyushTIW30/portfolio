import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { SectionHeader } from "./SectionHeader";
import { Send, Sparkles, User } from "lucide-react";
import { askGemini } from "@/lib/ask-ayush.server";

type Msg = { role: "user" | "ai"; text: string };

const suggestions = [
  "Tell me about Ayush",
  "What projects has he built?",
  "What's his tech stack?",
  "Why should I hire him?",
];

export function AskAyush() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi! I'm Ayush AI. Ask me anything about Ayush's projects, tech stack, work experience, or why you should hire him." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  async function send(q: string) {
    if (!q.trim() || thinking) return;
    setError("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    try {
      const reply = await askGemini({ data: { messages, userMessage: q } });
      setMessages((m) => [...m, { role: "ai", text: reply }]);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
      setMessages((m) => [...m, { role: "ai", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <section id="chat" className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          tag="// ask ayush ai"
          title="Recruiters: ask me anything."
          subtitle="Powered by Gemini AI. Ask about projects, stack, experience — anything."
        />
        <div className="glass rounded-3xl overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 bg-black/30">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
            </div>
            <span className="text-xs font-mono text-muted-foreground">ayush-ai · gemini-2.0-flash</span>
            <span className="ml-auto text-[10px] font-mono text-green-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> online
            </span>
          </div>

          {/* Messages */}
          <div className="p-5 sm:p-6 space-y-4 max-h-[420px] overflow-y-auto">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
              >
                {m.role === "ai" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-neon-purple to-neon-blue text-primary-foreground"
                    : "bg-white/5 border border-white/10 text-foreground"
                }`}>
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
            {thinking && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-bounce [animation-delay:.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-bounce [animation-delay:.3s]" />
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="text-xs text-red-400 font-mono px-2">{error}</div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions + input */}
          <div className="px-5 pb-5 space-y-3">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={thinking}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-neon-purple/40 hover:text-neon-purple transition disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex gap-2 glass rounded-xl p-1.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Ayush's projects, stack, experience..."
                disabled={thinking}
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={thinking || !input.trim()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-40 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
