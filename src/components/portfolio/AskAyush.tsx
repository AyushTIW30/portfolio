import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { SectionHeader } from "./SectionHeader";
import { Send, Sparkles, User } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const SYSTEM_PROMPT = `You are "Ayush AI" — a helpful assistant on Ayush Tiwari's portfolio website. Your ONLY job is to answer questions about Ayush professionally and convincingly, as if you are his personal representative.

Here is everything you know about Ayush:

PERSONAL:
- Full name: Ayush Tiwari
- Based in Jabalpur, Madhya Pradesh, India
- Final-year B.Tech Computer Science student at Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), CGPA: 8.01
- Open to opportunities, willing to relocate
- Email: tiwari.ayush.tech@gmail.com
- GitHub: github.com/AyushTIW30
- LinkedIn: linkedin.com/in/ayush-tiwari-2301222ba
- Portfolio: ayush-tiwari-portfolio.onrender.com

CURRENT EXPERIENCE:
- AI Automation & Data Developer Intern (Mar 2026 – Sep 2026): Building production AI search and data platforms. Work includes RAG pipelines, Python scrapers, multi-provider LLM integrations, backend APIs, website content classification & tagging, vector embedding pipelines, and automated error tracking systems.
- Prior: 15-day MERN Stack Teaching Intern at CRISP VITS Satna (Dec 2024)

SKILLS & TECH STACK:
- Backend: Python, FastAPI, Django, Node.js, REST APIs, Authentication (custom TOTP 2FA), System Design
- AI/LLMs: RAG Pipelines, LLM Integrations, Prompt Engineering, Vector Search, AI Agents, AI Automation, multi-provider LLM routing (Gemini, Groq, OpenRouter, HuggingFace, NVIDIA NIM)
- Databases: PostgreSQL, MySQL, SQLite, SQL, Query Optimization, Schema Design
- Data: Pandas, NumPy, Matplotlib, Seaborn, Power BI, Excel, ETL, Data Processing
- Tools: Git, GitHub, Docker, Postman, VS Code, n8n, Streamlit
- Frontend (basics): React, HTML/CSS, JavaScript
- DSA: Arrays, Strings, Stacks, Queues, Recursion, Linked Lists, Tree Traversals

PROJECTS:
1. AI Data Analytics App (FLAGSHIP) — Python, Streamlit, Pandas, Plotly, LLMs. Users upload CSV and query in natural language. Live at Streamlit Cloud.
2. Autonomous AI Communication System — Python, n8n, LLMs, Telegram API, FastAPI. Email AI Agent, Telegram Bot with memory, Web Chat Interface.
3. RAG Knowledge System — Python, FastAPI, Vector DB, LLMs. End-to-end RAG: ingestion, chunking, embeddings, hybrid retrieval, cited answer generation.
4. Loan Approval Prediction — Python, Scikit-learn, Pandas, NumPy, Streamlit. ML pipeline for credit risk classification.
5. Django Portfolio Platform — Django, Python, PostgreSQL, HTML/CSS. Admin-driven dynamic content, deployed on Render.

CERTIFICATIONS:
- IBM Prompt Engineering for Everyone (IBM/Coursera)
- Microsoft AI-900: Azure AI Fundamentals (Microsoft)
- Python for Data Science, AI & Development (IBM/Coursera)

RESPONSE RULES:
- Always answer in the context of Ayush's portfolio only. Never go off-topic.
- Be professional, confident, and concise. Max 3-4 sentences unless more detail is asked.
- If asked something not listed above, say "That info isn't available here — reach Ayush directly at tiwari.ayush.tech@gmail.com"
- Never make up information not listed above.
- Speak in third person about Ayush (e.g., "Ayush has built...", "He specializes in...")`;

const suggestions = [
  "Tell me about Ayush",
  "What projects has he built?",
  "What's his tech stack?",
  "Why should I hire him?",
];

// API key comes from .env — set VITE_GEMINI_API_KEY in your .env file
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

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

  async function callGemini(userMessage: string): Promise<string> {
    if (!GEMINI_API_KEY) {
      return "AI chat is not configured yet. Please contact Ayush at tiwari.ayush.tech@gmail.com";
    }

    const history = messages
      .filter((_, i) => i > 0)
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

    const body = {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        ...history,
        { role: "user", parts: [{ text: userMessage }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (res.status === 429) throw new Error("Rate limit hit. Please try again in a moment.");
      throw new Error(err?.error?.message || "Something went wrong. Please try again.");
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
  }

  async function send(q: string) {
    if (!q.trim() || thinking) return;
    setError("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    try {
      const reply = await callGemini(q);
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
