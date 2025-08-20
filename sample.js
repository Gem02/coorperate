// (chat in the dispatchEvent(event));import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Smartphone,
  Sparkles,
  Download,
  Mail,
  Github,
  Linkedin,
  MapPin,
  ArrowUpRight,
  Star,
  Rocket,
  Cpu,
  Palette,
  Workflow,
  ShieldCheck,
  Zap,
} from "lucide-react";

// =========================
// Jaw‑Dropping About Me Page
// React (JavaScript only) + TailwindCSS + Framer Motion + Lucide icons
// Drop this component into your React app and render <AboutMePage />
// =========================

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export default function AboutMePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-neutral-950 via-neutral-950 to-black text-neutral-100">
      {/* Floating Aurora Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/20 via-sky-400/10 to-fuchsia-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-teal-400/10 via-emerald-400/10 to-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -right-24 h-[26rem] w-[26rem] rounded-full bg-gradient-to-tr from-purple-500/10 via-pink-400/10 to-orange-400/10 blur-3xl" />
      </div>

      {/* Page Container */}
      <main className="mx-auto w-full max-w-7xl px-5 py-16 md:px-8 md:py-20">
        {/* HERO */}
        <motion.section
          variants={stagger}
          initial="hidden"
          animate="show"
          className="mb-16 grid gap-8 md:mb-24 md:grid-cols-[1.2fr_0.8fr]"
        >
          <motion.div variants={fadeUp} className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wider text-white/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> ABOUT ME
            </div>
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-[-0.02em] text-white md:text-6xl">
              I design & build
              <span className="block bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                intelligent digital experiences
              </span>
              that convert.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-white/70 md:text-base">
              I’m a full‑stack developer and product crafter focused on shipping elegant, high‑performance web and mobile solutions. My work blends engineering rigor with design sensitivity to deliver experiences users love — and businesses measure.
            </p>

            {/* Quick CTA Row */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:shadow-white/20 md:px-5 md:py-2.5"
              >
                <Mail className="h-4 w-4" /> Let’s collaborate
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/25 hover:bg-white/10 md:px-5 md:py-2.5"
              >
                <Download className="h-4 w-4" /> Download résumé
              </a>
            </div>

            {/* Meta row */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-white/60">
              <div className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Remote • Global</div>
              <div className="inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> 7+ yrs experience</div>
              <div className="inline-flex items-center gap-2"><Star className="h-3.5 w-3.5" /> 35+ shipped products</div>
            </div>
          </motion.div>

          {/* Signature Card */}
          <motion.div variants={fadeUp} className="relative">
            <div className="group relative h-full rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-xl">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-fuchsia-500/10 via-indigo-500/10 to-cyan-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/60">Signature Stack</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/90">
                    <Badge>React</Badge>
                    <Badge>Node</Badge>
                    <Badge>Next.js</Badge>
                    <Badge>Tailwind</Badge>
                    <Badge>PostgreSQL</Badge>
                    <Badge>Prisma</Badge>
                    <Badge>React Native</Badge>
                    <Badge>Cloudflare</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <MiniStat label="Avg. TTI" value="< 1.3s" />
                  <MiniStat label="Core Web Vitals" value="> 95%" />
                  <MiniStat label="Deploy freq" value="weekly" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* VALUE PROPOSITION */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mb-16 md:mb-24">
          <div className="grid gap-6 md:grid-cols-3">
            <ValueCard
              icon={<Palette className="h-5 w-5" />}
              title={<>
                Design <span className="text-white/60">meets</span> Engineering
              </>}
              text="Pixel‑accurate interfaces married with robust architecture. Nothing ship‑it‑and‑pray."
            />
            <ValueCard
              icon={<Workflow className="h-5 w-5" />}
              title="Outcome‑driven Delivery"
              text="Launch faster, iterate smarter. Roadmaps that prioritize impact over output."
            />
            <ValueCard
              icon={<Zap className="h-5 w-5" />}
              title="Performance as a Feature"
              text="Obsessive attention to speed, accessibility, and reliability — because UX = DX."
            />
          </div>
        </motion.section>

        {/* STORY / TIMELINE */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mb-16 md:mb-24">
          <div className="mb-8 flex items-end justify-between">
            <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight md:text-3xl">A short story, told in shipped things</motion.h2>
            <motion.div variants={fadeUp} className="text-xs text-white/60">2018 → Present</motion.div>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-white/40 via-white/10 to-transparent md:left-4" />
            <div className="space-y-6">
              {TIMELINE.map((item, idx) => (
                <TimelineItem key={idx} {...item} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* SKILLS MATRIX */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mb-16 md:mb-24">
          <motion.h2 variants={fadeUp} className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">Skills, not buzzwords</motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            <SkillPanel title="Front‑end Craft" items={["React / Next.js", "State machines & hooks", "Animations (Framer Motion)", "Tailwind & design systems", "Accessibility (WCAG) ", "Core Web Vitals"]} />
            <SkillPanel title="Back‑end & DevOps" items={["Node / Express", "PostgreSQL / Prisma", "REST & GraphQL", "Auth & security", "CI/CD & testing", "Cloudflare / Vercel / AWS"]} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {TECH_TAGS.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </motion.section>

        {/* MICRO SHOWCASE */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mb-16 md:mb-24">
          <motion.h2 variants={fadeUp} className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">Impact snapshots</motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            {IMPACTS.map((card, i) => (
              <ImpactCard key={i} {...card} />
            ))}
          </div>
        </motion.section>

        {/* TESTIMONIALS */}
        <motion.section id="testimonials" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mb-16 md:mb-24">
          <motion.h2 variants={fadeUp} className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">What partners say</motion.h2>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Testimonial key={i} {...t} />
            ))}
          </div>
        </motion.section>

        {/* CREDENTIALS / STATS BELT */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mb-16 md:mb-24">
          <div className="grid gap-6 md:grid-cols-4">
            <BeltStat icon={<Rocket className="h-5 w-5" />} label="Products launched" value="35+" />
            <BeltStat icon={<Cpu className="h-5 w-5" />} label="Tech lead roles" value="8" />
            <BeltStat icon={<Code2 className="h-5 w-5" />} label="Open‑source repos" value="27" />
            <BeltStat icon={<Star className="h-5 w-5" />} label="Avg. client rating" value="4.9/5" />
          </div>
        </motion.section>

        {/* PERSONALITY STRIP */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mb-16 md:mb-24">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-xl md:p-8">
            <motion.h3 variants={fadeUp} className="text-xl font-semibold md:text-2xl">Beyond the code</motion.h3>
            <motion.p variants={fadeUp} className="mt-2 max-w-3xl text-sm text-white/70 md:text-base">
              I’m a systems thinker and lifelong learner. I sketch interfaces before I write functions, read metrics before I rewrite modules, and believe that candor, curiosity, and craftsmanship compound.
            </motion.p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                "Coffee‑first, commit‑later ☕",
                "Figma frames = thinking",
                "Keyboard shortcuts evangelist",
                "Reads PRs like novels",
                "Type‑safe at heart, JS by request",
                "Design tokens believer",
                "Edge‑first deployments",
                "Weekend tinkerer: hardware + AI",
              ].map((chip) => (
                <Chip key={chip} label={chip} />
              ))}
            </div>
          </div>
        </motion.section>

        {/* CONTACT CTA */}
        <motion.section id="contact" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-fuchsia-500/10 to-teal-500/10 p-6 backdrop-blur-xl md:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold md:text-3xl">Let’s build what your users will remember</h3>
                <p className="mt-2 max-w-xl text-sm text-white/70 md:text-base">
                  Brief me on your goals in a quick email — I’ll reply with a short plan and a realistic timeline.
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
                <a
                  href="mailto:hello@yourdomain.dev"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-black shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:shadow-white/20"
                >
                  <Mail className="h-5 w-5" /> Email me
                </a>
                <a
                  href="https://github.com/yourhandle"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white/90 backdrop-blur transition hover:border-white/25 hover:bg-white/10"
                >
                  <Github className="h-5 w-5" /> GitHub
                </a>
                <a
                  href="https://linkedin.com/in/yourhandle"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-semibold text-white/90 backdrop-blur transition hover:border-white/25 hover:bg-white/10"
                >
                  <Linkedin className="h-5 w-5" /> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

// ===== Subcomponents =====

function ValueCard({ icon, title, text }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-tr from-white/10 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="mb-4 inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-2">
        <div className="opacity-90">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-white md:text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{text}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function TimelineItem({ year, role, company, summary, badges }) {
  return (
    <motion.div variants={fadeUp} className="relative ml-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="absolute -left-6 top-5 grid place-items-center">
        <div className="h-3 w-3 rounded-full bg-white" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold text-white/90 md:text-base">{role} • <span className="text-white/60">{company}</span></div>
        <div className="text-xs text-white/60">{year}</div>
      </div>
      <p className="mt-2 text-sm text-white/70">{summary}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {badges?.map((b) => (
          <Badge key={b}>{b}</Badge>
        ))}
      </div>
    </motion.div>
  );
}

function SkillPanel({ title, items }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-white md:text-xl">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-white/80">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10">
              <CheckmarkIcon />
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImpactCard({ icon, title, metric, desc }) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-3 inline-flex items-center gap-2 text-sm text-white/60">
        <span className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 p-2">
          {icon}
        </span>
        <span>{title}</span>
      </div>
      <div className="text-3xl font-semibold tracking-tight text-white">{metric}</div>
      <p className="mt-2 text-sm text-white/70">{desc}</p>
    </div>
  );
}

function Testimonial({ quote, name, role }) {
  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur-xl">
      <StarRow />
      <p className="mt-3 text-pretty text-sm text-white/80 md:text-base">“{quote}”</p>
      <div className="mt-4 text-sm font-medium text-white">{name}</div>
      <div className="text-xs text-white/60">{role}</div>
    </div>
  );
}

function BeltStat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-2 text-white/90">
        {icon}
      </div>
      <div>
        <div className="text-xs text-white/60">{label}</div>
        <div className="text-lg font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

function Chip({ label }) {
  return (
    <div className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      {label}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90">
      {children}
    </span>
  );
}

function CheckmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current text-white/80">
      <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 20.3 7.7l-1.4-1.4z" />
    </svg>
  );
}

function StarRow() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="h-4 w-4 text-yellow-300" />
      ))}
    </div>
  );
}

// ===== Data =====

const TIMELINE = [
  {
    year: "2024 – Present",
    role: "Lead Front‑end Engineer",
    company: "Freelance / Studio",
    summary:
      "Owning product from discovery to delivery. Designing systems, building for performance, mentoring devs, and partnering with founders to hit metrics.",
    badges: ["Design systems", "A/B testing", "Edge compute"],
  },
  {
    year: "2021 – 2024",
    role: "Full‑stack Developer",
    company: "SaaS & Startups",
    summary:
      "Launched multi‑tenant platforms, real‑time dashboards, and high‑conversion marketing sites. Built pipelines and hardened auth.",
    badges: ["Prisma", "PostgreSQL", "CI/CD"],
  },
  {
    year: "2018 – 2021",
    role: "Front‑end Engineer",
    company: "Agency / Consulting",
    summary:
      "Shipped pixel‑perfect websites and PWAs for global brands. Focused on motion design, accessibility, and SEO.",
    badges: ["SEO", "PWA", "Accessibility"],
  },
];

const TECH_TAGS = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "React Native",
  "TailwindCSS",
  "Framer Motion",
  "TypeScript (optional)",
  "Prisma",
  "PostgreSQL",
  "Vercel",
  "Cloudflare",
  "GraphQL",
  "Zustand",
  "Jest",
  "Playwright",
];

const IMPACTS = [
  {
    icon: <Rocket className="h-5 w-5" />,
    title: "Conversion uplift",
    metric: "+38%",
    desc: "Redesigned onboarding flow with progressive disclosure and live validation.",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Cold start solved",
    metric: "120ms",
    desc: "Edge‑cached critical routes and optimized payloads for TTFB.",
  },
  {
    icon: <Smartphone className="h-5 w-5" />,
    title: "App retention",
    metric: "+24%",
    desc: "Introduced session replays, fixed friction points, and added offline‑first.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "A rare blend of taste and technical depth. Our product felt premium — and the metrics agreed.",
    name: "Adaeze K.",
    role: "Founder, Fintech SaaS",
  },
  {
    quote:
      "Communicates clearly, delivers predictably, and sweats the details. A partner, not just a dev.",
    name: "Samir A.",
    role: "Head of Product, Healthtech",
  },
  {
    quote:
      "Turned a messy codebase into a scalable foundation with a design we’re proud of.",
    name: "Lara M.",
    role: "CTO, Marketplace",
  },
];
