import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const timeline = [
  {
    year: "Mar 2026 — Sep 2026",
    title: "AI Automation & Data Developer Intern",
    body: "Building AI-powered search and data platforms end-to-end: RAG pipelines, Python scrapers, multi-provider LLM integrations, backend APIs, website content classification & tagging, vector embedding pipelines, and automated error tracking systems.",
  },
  {
    year: "2025 — 2026",
    title: "AI Systems & RAG Engineering",
    body: "Built production RAG pipelines, LLM-integrated tools, semantic search systems, multi-provider LLM routing, and intelligent automation agents.",
  },
  {
    year: "2024 — 2025",
    title: "Backend & APIs",
    body: "Designed and shipped FastAPI and Django services: auth flows (custom TOTP 2FA), REST contracts, database modeling (PostgreSQL, MySQL), and clean service boundaries.",
  },
  {
    year: "Dec 2024",
    title: "MERN Stack Teaching Intern — CRISP VITS Satna",
    body: "15-day teaching internship covering MERN stack fundamentals for students.",
  },
  {
    year: "2023 — 2024",
    title: "Foundations",
    body: "Deep dive into Python, SQL, system design, and the core web stack. First serious projects shipped: AI data analytics app, ML models, Django portfolio platform.",
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="// journey" title="Engineering journey." />
        <div className="relative">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-neon-purple via-neon-blue to-transparent" />
          <div className="space-y-10">
            {timeline.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative pl-12"
              >
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-background border-2 border-neon-purple flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-neon-cyan mb-1">{t.year}</div>
                <h3 className="font-semibold text-lg mb-1">{t.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
