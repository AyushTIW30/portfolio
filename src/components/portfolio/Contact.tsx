import { motion } from "framer-motion";
import { useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Mail, Send, Link as LinkIcon, Code2 } from "lucide-react";

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          tag="// transmission"
          title="Open a channel."
          subtitle="Drop a message — it lands directly in my inbox."
        />
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <ContactLink icon={Mail} label="Email" value="tiwari.ayush.tech@gmail.com" href="mailto:tiwari.ayush.tech@gmail.com" />
            <ContactLink icon={LinkIcon} label="LinkedIn" value="linkedin.com/in/ayush-tiwari-2301222ba" href="https://linkedin.com/in/ayush-tiwari-2301222ba" />
            <ContactLink icon={Code2} label="GitHub" value="github.com/AyushTIW30" href="https://github.com/AyushTIW30" />
            <ContactLink icon={LinkIcon} label="Portfolio" value="ayush-tiwari-portfolio.onrender.com" href="https://ayush-tiwari-portfolio.onrender.com" />
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="lg:col-span-3 glass rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-white/5">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">terminal · transmit.new</span>
            </div>
            <Field label="From" placeholder="Your name" />
            <Field label="Channel" placeholder="you@company.com" type="email" />
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-neon-cyan">Payload</label>
              <textarea required rows={4} placeholder="What are you building?" className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-neon-purple/50 transition resize-none" />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-primary-foreground text-sm font-medium hover:opacity-90 transition glow-purple"
            >
              <Send className="w-4 h-4" />
              {sent ? "Transmission sent ✓" : "Send transmission"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-[10px] font-mono uppercase tracking-wider text-neon-cyan">{label}</label>
      <input required {...props} className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-neon-purple/50 transition" />
    </div>
  );
}

function ContactLink({ icon: Icon, label, value, href }: any) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="glass rounded-2xl p-4 flex items-center gap-4 hover:border-neon-purple/40 transition group">
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-neon-purple/20 transition">
        <Icon className="w-5 h-5 text-neon-purple" />
      </div>
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </a>
  );
}