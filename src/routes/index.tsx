import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Architecture } from "@/components/portfolio/Architecture";
import { Experience } from "@/components/portfolio/Experience";
import { Github } from "@/components/portfolio/Github";
import { AskAyush } from "@/components/portfolio/AskAyush";
import { Resume } from "@/components/portfolio/Resume";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ayush Tiwari — AI & Backend Engineer | Python, FastAPI, RAG" },
      { name: "description", content: "Backend engineer building intelligent systems with Python, FastAPI, RAG pipelines, LLMs, and scalable APIs." },
      { property: "og:title", content: "Ayush Tiwari — AI & Backend Engineer" },
      { property: "og:description", content: "Building intelligent systems that solve real problems. Python · FastAPI · RAG · LLMs." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Ayush Tiwari",
          jobTitle: "AI & Backend Engineer",
          url: "/",
          sameAs: ["https://github.com/AyushTIW30"],
          knowsAbout: ["Python", "FastAPI", "Django", "RAG", "LLMs", "SQL", "Backend Engineering"],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen">
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Architecture />
      <Experience />
      <Github />
      <AskAyush />
      <Resume />
      <Contact />
      <Footer />
    </main>
  );
}
