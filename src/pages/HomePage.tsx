import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeIndianRupee,
  Check,
  Clock3,
  Gauge,
  Mail,
  MapPin,
  Minus,
  MousePointer2,
  Play,
  Plus,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  capabilities,
  caseStudies,
  faqs,
  industries,
  processSteps,
  reasons,
  serviceCatalog,
  services,
  team,
  testimonials,
} from "../data/content";
import { sendBusinessEmail } from "../lib/email";
import { playSound } from "../lib/sound";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Aurora, CountUp, PrimaryButton, Reveal, SectionHeading } from "../components/ui";

const heroStats = [
  ["7.1×", "Avg ROAS"],
  ["120+", "Active Clients"],
  ["94%", "Retention"],
  ["$80M+", "Media Managed"],
];

const resultStats = [
  { value: 80, prefix: "$", suffix: "M+", label: "Ad Spend Managed", progress: 88, color: "gold" },
  { value: 120, suffix: "+", label: "Active Engagements", progress: 78, color: "purple" },
  { value: 7.1, suffix: "×", label: "Campaign ROI", progress: 91, color: "cyan", decimals: 1 },
  { value: 142, suffix: "%", label: "Pipeline Growth", progress: 84, color: "rose" },
  { value: 94, suffix: "%", label: "Client Retention", progress: 94, color: "green" },
  { value: 90, suffix: "%", label: "Conversion Lift", progress: 90, color: "gold" },
];

const particles = Array.from({ length: 70 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  top: `${(index * 53 + 7) % 100}%`,
  delay: `${(index % 14) * -0.7}s`,
  duration: `${9 + (index % 8)}s`,
}));

function Hero() {
  const words = ["Universe", "Empire", "Legacy", "Dynasty"];
  const [word, setWord] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setWord((value) => (value + 1) % words.length), 2400);
    return () => window.clearInterval(timer);
  }, [words.length]);

  return (
    <section className="hero" id="home">
      <img src="/images/prime-polo-hero.jpg" alt="Prime Polo senior growth team in an AI-enabled strategy studio" className="hero-image" />
      <div className="hero-shade" />
      <Aurora />
      <div className="particles" aria-hidden="true">{particles.map((particle, index) => <span key={index} style={{ left: particle.left, top: particle.top, animationDelay: particle.delay, animationDuration: particle.duration }} />)}</div>
      <div className="orbital orbital-one" /><div className="orbital orbital-two" /><div className="orbital orbital-three" />
      <div className="container-elite hero-content">
        <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="hero-overline"><i /><span>AI-Powered Growth Partner</span><b />Est. 2018</span>
          <div className="hero-brand-signal"><span>PRIME</span><span>POLO</span></div>
          <h1>Growth Engineered<br /><em>For Modern Brands.</em></h1>
          <div className="rotating-line">
            <span>Build Your</span>
            <AnimatePresence mode="wait">
              <motion.strong key={words[word]} initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: 0.45 }}>{words[word]}</motion.strong>
            </AnimatePresence>
          </div>
          <p>AI-powered marketing, automation, websites and performance strategies for ambitious brands ready to turn attention into durable, measurable growth.</p>
          <div className="hero-actions">
            <PrimaryButton href="#contact">Begin Your Journey</PrimaryButton>
            <a className="btn-outline" href="#casestudies"><span><Play size={14} fill="currentColor" /></span>Explore Work</a>
          </div>
        </motion.div>
      </div>
      <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.7 }}>
        <div className="container-elite">{heroStats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      </motion.div>
      <a className="scroll-cue" href="#solutions"><span>Explore</span><ArrowDown /></a>
    </section>
  );
}

function Solutions() {
  return (
    <section className="section solutions" id="solutions">
      <div className="container-elite">
        <SectionHeading tag="✦ Solutions" title={<>A Full-Stack <span className="text-gradient-gold">Growth Partner</span></>} copy="Strategy, creative, technology and media working as one compounding system." />
        <div className="capabilities-grid">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.08}>
                <article className="capability card-elite">
                  <div className="capability-top"><span><Icon /></span><b>{item.number}</b></div>
                  <h3>{item.title}</h3><p>{item.description}</p>
                  <div className="feature-tags">{item.features.map((feature) => <span key={feature}><Check />{feature}</span>)}</div>
                  <ArrowUpRight className="capability-arrow" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Services() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="section services-section">
      <div className="container-elite">
        <SectionHeading tag="✦ Capabilities" title={<>Made to move at <span className="text-gradient-royal">market speed.</span></>} copy="Eight senior-led practices. One shared commercial objective." />
        <div className="services-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return <Reveal key={service.title} delay={(index % 4) * 0.06}><article className="service-item"><span className="service-number">0{index + 1}</span><Icon /><h3>{service.title}</h3><p>{service.description}</p><a href="#contact">Learn More<ArrowUpRight /></a></article></Reveal>;
          })}
        </div>
        <div className="center-action"><button className="btn-outline" onClick={() => setExpanded((value) => !value)}>{expanded ? "Close Services" : "View All Services"}{expanded ? <Minus /> : <Plus />}</button></div>
        <AnimatePresence>
          {expanded && (
            <motion.div className="service-catalog" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <div className="separator-elite" />
              <div className="catalog-intro"><span>Complete Practice Index</span><p>Deep capability when your roadmap demands it.</p></div>
              <div className="catalog-grid">
                {serviceCatalog.map((group, index) => {
                  const Icon = group.icon;
                  return <motion.article key={group.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (index % 4) * 0.05 }}><div><Icon /><b>{String(index + 1).padStart(2, "0")}</b></div><h4>{group.category}</h4><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></motion.article>;
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Industries() {
  const emoji = ["🏥", "🎓", "🏙️", "🏨", "🛒", "🚀", "💼", "📍"];
  return (
    <section className="section industries dot-grid" id="industries">
      <div className="container-elite">
        <SectionHeading tag="✦ Industries" title={<>Category <span className="text-gradient-gold">Expertise</span></>} copy="Domain fluency shortens the distance between insight and impact." />
        <div className="industry-grid">
          {industries.map(([name, copy, code], index) => <Reveal key={name} delay={(index % 4) * 0.05}><article className="industry-item"><span className="industry-emoji" aria-hidden="true">{emoji[index]}</span><small>{code} / 0{index + 1}</small><h3>{name}</h3><p>{copy}</p><ArrowUpRight /></article></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function ProgressRing({ stat, index }: { stat: typeof resultStats[number]; index: number }) {
  const circumference = 2 * Math.PI * 70;
  return (
    <Reveal delay={index * 0.06}>
      <article className="result-ring">
        <svg viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" className="ring-track" />
          <motion.circle cx="80" cy="80" r="70" className={`ring-value ring-${stat.color}`} strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} whileInView={{ strokeDashoffset: circumference * (1 - stat.progress / 100) }} viewport={{ once: true }} transition={{ duration: 1.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }} />
        </svg>
        <strong><CountUp to={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} /></strong>
        <span>{stat.label}</span>
      </article>
    </Reveal>
  );
}

function Results() {
  const bars = [32, 40, 49, 57, 68, 78, 94];
  return (
    <section className="section results" id="results">
      <Aurora compact />
      <div className="container-elite relative z-10">
        <SectionHeading tag="✦ Results" title={<>Numbers We're <span className="text-gradient-elite">Proud Of</span></>} copy="A scorecard built around commercial movement, not presentation theatre." align="center" />
        <div className="rings-grid">{resultStats.map((stat, index) => <ProgressRing key={stat.label} stat={stat} index={index} />)}</div>
        <Reveal className="pipeline-chart glass-elite">
          <div className="chart-title"><div><span>Client Pipeline Growth</span><small>Quarterly growth index</small></div><strong>+142%<small>vs. baseline</small></strong></div>
          <div className="chart-area">
            <div className="chart-lines"><span /><span /><span /><span /></div>
            <div className="bars">{bars.map((height, index) => <div key={height}><motion.span initial={{ height: 0 }} whileInView={{ height: `${height}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: index * 0.08 }}><i>{height}</i></motion.span><small>Q{index + 1}</small></div>)}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CaseStudies() {
  const [active, setActive] = useState(0);
  const change = (direction: number) => setActive((value) => (value + direction + caseStudies.length) % caseStudies.length);
  const item = caseStudies[active];
  return (
    <section className="section cases" id="casestudies">
      <div className="container-elite">
        <div className="heading-row"><SectionHeading tag="✦ Case Studies" title={<>Featured <span className="text-gradient-gold">Work</span></>} copy="Growth systems translated into category-defining outcomes." /><div className="carousel-controls"><button onClick={() => change(-1)} aria-label="Previous case study"><ArrowLeft /></button><button onClick={() => change(1)} aria-label="Next case study"><ArrowRight /></button></div></div>
        <div className="case-stage">
          <AnimatePresence mode="wait">
            <motion.article key={item.client} className="case-slide" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5 }}>
              <img src={item.image} alt={`${item.client} growth case study`} />
              <div className="case-gradient" />
              <div className="case-info">
                <span>{item.industry} / 0{active + 1}</span><h3>{item.client}</h3><p>{item.challenge}</p>
                <div className="case-metrics">{item.metrics.map(([value, label]) => <div key={label}><TrendingUp /><strong>{value}</strong><span>{label}</span></div>)}</div>
                <blockquote>“{item.quote}”</blockquote>
                <PrimaryButton href="#contact">Get Similar Results</PrimaryButton>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
        <div className="case-dots">{caseStudies.map((study, index) => <button key={study.client} onClick={() => setActive(index)} className={index === active ? "active" : ""} aria-label={`Show ${study.client}`}><span /></button>)}</div>
      </div>
    </section>
  );
}

function Why() {
  return (
    <section className="section why dot-grid" id="about">
      <div className="container-elite">
        <SectionHeading tag="✦ Why Prime Polo" title={<>Built Like a <span className="text-gradient-royal">Product Team</span></>} copy="A deliberately different operating model for brands that value speed, seniority and truth." align="center" />
        <div className="reasons-grid">{reasons.map((reason, index) => { const Icon = reason.icon; return <Reveal key={reason.title} delay={(index % 3) * 0.07}><article className="reason-item"><span><Icon /></span><h3>{reason.title}</h3><p>{reason.description}</p></article></Reveal>; })}</div>
        <Reveal className="story-panel glass-gold">
          <div className="story-copy"><span className="section-tag">Our Story</span><h3>Small roster.<br />Uncommon depth.</h3><p>Prime Polo was founded in 2018 by Shaurya Kumar, alongside senior marketers from luxury houses and VC-backed startups who believed agencies had become too distant from the work.</p><p>We deliberately limit our roster. Every engagement is led and executed by specialists with 10+ years of experience. No junior staffing. No opaque handoffs. Just a focused team with the range to find the constraint and the craft to move it.</p><div className="signature">Shaurya Kumar <span>Founder & CEO</span></div></div>
          <div className="story-stats">{[["2018", "Founded"], ["120+", "Brands Grown"], ["$80M", "Media Managed"], ["94%", "Retention"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        </Reveal>
        <div className="team-strip">{team.map(([name, role, initials]) => <div key={name}><span>{initials}</span><strong>{name}<small>{role}</small></strong></div>)}</div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section process" id="process">
      <div className="container-elite process-layout">
        <div className="process-heading"><SectionHeading tag="✦ Process" title={<>From Discovery<br />to <span className="text-gradient-gold">Scale</span></>} copy="A high-velocity operating rhythm designed to learn quickly and compound what works." /><div className="process-orbit"><MousePointer2 /><span>5 stages</span></div></div>
        <div className="timeline">
          {processSteps.map(([number, title, description, Icon], index) => <Reveal key={title} delay={index * 0.05}><article className="timeline-item"><div className="timeline-rail"><span><Icon /></span></div><div className="timeline-content"><small>{number} / 05</small><h3>{title}</h3><p>{description}</p></div></article></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setActive((value) => (value + 1) % testimonials.length), 5000); return () => window.clearInterval(timer); }, []);
  const item = testimonials[active];
  return (
    <section className="section testimonials">
      <div className="container-elite">
        <SectionHeading tag="✦ Testimonials" title={<>Loved by <span className="text-gradient-elite">Growth Leaders</span></>} copy="Partnerships measured by what moved and how it felt to get there." align="center" />
        <div className="testimonial-stage">
          <div className="quote-mark">“</div>
          <AnimatePresence mode="wait"><motion.article key={item.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><div className="stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} fill="currentColor" />)}</div><blockquote>{item.quote}</blockquote><div className="testimonial-person"><span>{item.avatar}</span><strong>{item.name}<small>{item.role}</small></strong><b>{item.result}</b></div></motion.article></AnimatePresence>
        </div>
        <div className="testimonial-tabs">{testimonials.map((testimonial, index) => <button key={testimonial.name} onClick={() => setActive(index)} className={index === active ? "active" : ""}><span>{testimonial.avatar}</span><i /></button>)}</div>
      </div>
    </section>
  );
}

function formatInr(value: number) {
  if (value >= 10_000_000) return `₹${(value / 10_000_000).toFixed(1)}Cr`;
  if (value >= 100_000) return `₹${(value / 100_000).toFixed(1)}L`;
  return `₹${Math.round(value / 1000)}K`;
}

function Slider({ label, value, min, max, step, onChange, formatted }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; formatted: string }) {
  const progress = ((value - min) / (max - min)) * 100;
  return <label className="slider-field"><span>{label}<strong>{formatted}</strong></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ background: `linear-gradient(90deg, #8b3dff ${progress}%, var(--range-track) ${progress}%)` }} /><small><i>{label === "Monthly Leads" ? min : formatInr(min)}</i><i>{label === "Monthly Leads" ? max : formatInr(max)}</i></small></label>;
}

function Calculator() {
  const [revenue, setRevenue] = useState(15_000_000);
  const [leads, setLeads] = useState(800);
  const [spend, setSpend] = useState(800_000);
  const projections = useMemo(() => ({ revenue: revenue * 1.42, additional: revenue * 0.42, leads: Math.round(leads * 2.14) }), [revenue, leads]);
  return (
    <section className="section calculator dot-grid" id="calculator">
      <div className="container-elite">
        <SectionHeading tag="✦ Calculator" title={<>See Your <span className="text-gradient-gold">Growth Potential</span></>} copy="Model the upside using the average performance profile across Prime Polo engagements." align="center" />
        <Reveal className="calculator-shell glass-elite">
          <div className="calculator-inputs"><h3>Adjust your baseline</h3><p>Move the sliders to match your current operating picture.</p><Slider label="Annual Revenue" value={revenue} min={500_000} max={100_000_000} step={500_000} onChange={setRevenue} formatted={formatInr(revenue)} /><Slider label="Monthly Leads" value={leads} min={50} max={5000} step={50} onChange={setLeads} formatted={leads.toLocaleString("en-IN")} /><Slider label="Monthly Ad Spend" value={spend} min={50_000} max={5_000_000} step={50_000} onChange={setSpend} formatted={formatInr(spend)} /></div>
          <div className="calculator-results"><div className="calc-overline"><Sparkles />Projected with Prime Polo</div><div className="calc-primary"><span>Projected Revenue</span><strong>{formatInr(projections.revenue)}</strong><small>+42% modeled annual uplift</small></div><div className="calc-grid"><div><BadgeIndianRupee /><span>Additional Revenue</span><strong>{formatInr(projections.additional)}</strong></div><div><Users /><span>Projected Monthly Leads</span><strong>{projections.leads.toLocaleString("en-IN")}</strong></div></div><div className="roas-badge"><Gauge /><span><strong>7.1×</strong> Average ROAS benchmark</span></div><PrimaryButton href="#contact">Get Custom Plan</PrimaryButton></div>
        </Reveal>
        <p className="calculator-note">Illustrative estimates based on portfolio averages. Results vary by category, offer and baseline.</p>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq">
      <div className="container-elite faq-layout">
        <div><SectionHeading tag="✦ FAQ" title={<>Frequently<br /><span className="text-gradient-royal">Asked</span></>} copy="Straight answers before we start the conversation." /><a href="mailto:primepolo03@gmail.com" className="faq-email"><Mail />Still curious?<span>primepolo03@gmail.com</span></a></div>
        <div className="faq-list">{faqs.map(([question, answer], index) => <article key={question} className={index === open ? "active" : ""}><button onClick={() => setOpen(index === open ? -1 : index)}><span>0{index + 1}</span><strong>{question}</strong><i>{index === open ? <Minus /> : <Plus />}</i></button><AnimatePresence initial={false}>{index === open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p>{answer}</p></motion.div>}</AnimatePresence></article>)}</div>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading"); setMessage("");
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(Array.from(form.entries()).map(([key, value]) => [key, String(value).trim().slice(0, key === "message" ? 2000 : 200)]));
    if (!values.name || !/^\S+@\S+\.\S+$/.test(values.email) || !values.message) { setStatus("error"); setMessage("Please add your name, a valid email and a short project brief."); return; }
    if (!isSupabaseConfigured) { setStatus("error"); setMessage("Supabase is not connected yet. Email us directly at primepolo03@gmail.com."); return; }
    try {
      const { error } = await supabase.from("leads").insert(values);
      if (error) throw error;
      await Promise.allSettled([sendBusinessEmail("New Prime Polo growth inquiry", Object.entries(values).map(([key, value]) => `${key}: ${value}`).join("\n"), values.email)]);
      setStatus("success"); setMessage("Message Sent Successfully"); playSound("success"); event.currentTarget.reset();
    } catch (error) {
      setStatus("error"); setMessage(error instanceof Error ? error.message : "The form could not be submitted. Please try again.");
    }
  };
  return (
    <section className="section contact" id="contact">
      <Aurora compact />
      <div className="container-elite relative z-10">
        <SectionHeading tag="✦ Start a Conversation" title={<>Ready to engineer<br /><span className="text-gradient-elite">what comes next?</span></>} copy="Tell us where growth is getting stuck. We will come back with a clear point of view." />
        <div className="contact-layout">
          <Reveal><form className="contact-form glass-elite" onSubmit={submit}><div className="form-grid"><label><span>Name *</span><input name="name" placeholder="Your full name" maxLength={120} required /></label><label><span>Email *</span><input name="email" type="email" placeholder="you@company.com" maxLength={160} required /></label><label><span>Phone</span><input name="phone" type="tel" placeholder="+91 98765 43210" maxLength={30} /></label><label><span>Company</span><input name="company" placeholder="Company name" maxLength={160} /></label><label><span>Service</span><select name="service" defaultValue=""><option value="" disabled>Select a focus</option>{services.map((service) => <option key={service.title}>{service.title}</option>)}</select></label><label><span>Monthly Budget</span><select name="budget" defaultValue=""><option value="" disabled>Select a range</option><option>INR 2L-5L</option><option>INR 5L-15L</option><option>INR 15L-50L</option><option>INR 50L+</option></select></label></div><label><span>What are we solving? *</span><textarea name="message" placeholder="Share the target, context and constraint..." maxLength={2000} required /></label><div className="form-submit"><PrimaryButton type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending Brief..." : "Send Growth Brief"}</PrimaryButton><small>By submitting, you agree to our Privacy Policy.</small></div>{message && <div className={`form-message ${status}`}>{status === "success" ? <Check /> : <X />}{message}</div>}</form></Reveal>
          <Reveal className="contact-side" delay={0.12}><div className="contact-details"><span>Direct line</span><a href="mailto:primepolo03@gmail.com"><Mail />primepolo03@gmail.com</a><p><MapPin />New Delhi, India</p><p><Clock3 />Mon-Fri, 10:00-19:00 IST</p></div><div className="map-visual"><div className="map-grid" /><svg viewBox="0 0 400 260" aria-label="Prime Polo location map in New Delhi"><path d="M-20 90 C70 65 92 116 150 93 S252 53 420 78" /><path d="M-20 190 C75 140 118 184 180 159 S298 146 430 185" /><path d="M88 -20 C112 53 95 105 129 143 S162 210 150 290" /><path d="M287 -20 C265 62 290 106 270 164 S270 230 294 290" /></svg><div className="map-pin"><span><MapPin /></span><i /><strong>PRIME POLO<small>New Delhi</small></strong></div><div className="coordinates">28.6139° N<br />77.2090° E</div></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  return <div className="marquee"><motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}>{Array.from({ length: 2 }, (_, group) => <div key={group}>{["AI-FIRST EXECUTION", "SENIOR-ONLY TEAMS", "LIVE REPORTING", "COMMERCIAL OUTCOMES", "3× FASTER DELIVERY"].map((item) => <span key={`${group}-${item}`}>{item}<i>✦</i></span>)}</div>)}</motion.div></div>;
}

export function HomePage() {
  return <main><Hero /><Marquee /><Solutions /><Services /><Industries /><Results /><CaseStudies /><Why /><Process /><Testimonials /><Calculator /><FAQ /><Contact /></main>;
}