import {
  Activity,
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Clapperboard,
  Cog,
  Compass,
  DatabaseZap,
  Fingerprint,
  Gauge,
  Globe2,
  Handshake,
  Layers3,
  LineChart,
  Megaphone,
  Palette,
  PenTool,
  Radar,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  WandSparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export const capabilities: Array<{
  number: string;
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
}> = [
  { number: "01", title: "Growth", description: "We build and operate the full funnel, connecting every channel to commercial outcomes.", features: ["SEO & Content", "Performance Marketing", "CRO & Analytics"], icon: TrendingUp },
  { number: "02", title: "Advertising", description: "Precision media across Google, Meta, LinkedIn and programmatic, backed by rigorous attribution.", features: ["Paid Search & Social", "Display & Video", "Attribution Modeling"], icon: Target },
  { number: "03", title: "Automation", description: "Intelligent systems that remove friction, enrich data and keep revenue teams moving.", features: ["Marketing Automation", "CRM Integration", "AI Workflows"], icon: Cog },
  { number: "04", title: "Digital Experiences", description: "Conversion-led experiences designed with the taste of a studio and built like a product team.", features: ["Website Development", "Landing Pages", "UX/UI Design"], icon: Globe2 },
];

export const services: Array<{ title: string; description: string; icon: LucideIcon }> = [
  { title: "Influencer Marketing", description: "Creator partnerships engineered for cultural reach and attributable revenue.", icon: Users },
  { title: "Social Media Marketing", description: "Always-on social systems that turn audience attention into demand.", icon: Megaphone },
  { title: "Performance Marketing", description: "Google and Meta campaigns managed against CAC, LTV and pipeline.", icon: Gauge },
  { title: "Search Engine Optimization", description: "Technical and editorial authority that compounds month after month.", icon: Search },
  { title: "Website Design & Development", description: "Distinct, high-converting digital products built for speed and scale.", icon: Layers3 },
  { title: "Content & Video Production", description: "Platform-native narratives with premium art direction and velocity.", icon: Clapperboard },
  { title: "Brand Strategy & Identity", description: "Positioning and visual systems that make category leadership tangible.", icon: Fingerprint },
  { title: "Lead Generation & Growth", description: "Full-funnel acquisition programs from first signal to closed revenue.", icon: Radar },
];

export const serviceCatalog = [
  { category: "Influencer & Creator Services", icon: Users, items: ["Creator sourcing and vetting", "Influencer campaign management", "UGC production", "Celebrity partnerships", "Affiliate creator programs", "Campaign measurement"] },
  { category: "Social Media Services", icon: Megaphone, items: ["Social strategy", "Community management", "Content calendars", "Executive social", "Social listening", "Platform reporting"] },
  { category: "Branding & Creative", icon: Palette, items: ["Brand positioning", "Visual identity systems", "Campaign concepts", "Design systems", "Pitch and sales decks", "Creative direction"] },
  { category: "Website Development", icon: PenTool, items: ["Marketing websites", "Landing page systems", "Web applications", "UX and UI design", "Conversion optimization", "Maintenance and support"] },
  { category: "SEO Services", icon: Search, items: ["Technical SEO", "Content strategy", "Local SEO", "Digital PR", "SEO migrations", "Authority reporting"] },
  { category: "Paid Advertising", icon: Target, items: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Programmatic media", "YouTube Ads", "Retargeting systems"] },
  { category: "Content Marketing", icon: Clapperboard, items: ["Editorial strategy", "Video production", "Thought leadership", "Copywriting", "Email newsletters", "Content distribution"] },
  { category: "E-commerce & Marketplace", icon: ShoppingBag, items: ["D2C growth", "Marketplace optimization", "Retention marketing", "Lifecycle automation", "Merchandising strategy", "Feed management"] },
  { category: "Analytics & Tracking", icon: BarChart3, items: ["GA4 implementation", "Server-side tracking", "Attribution modeling", "Live dashboards", "Funnel analytics", "Data governance"] },
  { category: "Reputation Management", icon: ShieldCheck, items: ["Review generation", "Sentiment monitoring", "Crisis response", "Search reputation", "Executive reputation", "Brand safety"] },
  { category: "Industry-Specific Marketing", icon: BriefcaseBusiness, items: ["Healthcare growth", "Education enrollment", "Real estate leads", "Hospitality demand", "SaaS acquisition", "Local business growth"] },
  { category: "Consulting & Strategy", icon: Compass, items: ["Growth audits", "Go-to-market strategy", "Fractional CMO", "Martech planning", "Team enablement", "Executive workshops"] },
];

export const industries = [
  ["Healthcare", "Hospital systems, clinics and healthtech", "HC"],
  ["Education", "Academies, edtech and institutions", "ED"],
  ["Real Estate", "Developers, brokers and proptech", "RE"],
  ["Hospitality", "Hotels, restaurants and travel", "HO"],
  ["E-commerce", "D2C brands and marketplaces", "EC"],
  ["Startups", "Venture-backed category builders", "ST"],
  ["Prof. Services", "Consultancies and B2B experts", "PS"],
  ["Local Business", "Multi-location and local leaders", "LB"],
];

export const caseStudies = [
  {
    client: "HealthFirst Clinics", industry: "Healthcare", image: "/images/case-health.jpg",
    challenge: "Patient acquisition costs were climbing while new locations needed a reliable demand engine.",
    metrics: [["+180%", "Patient Growth"], ["3", "New Locations"], ["-60%", "CAC Reduction"]],
    quote: "Prime Polo gave our expansion plan the certainty it was missing.",
  },
  {
    client: "EduLearn Academy", industry: "Education", image: "/images/case-education.jpg",
    challenge: "Enrollment needed to scale without compromising lead quality or counselor capacity.",
    metrics: [["+310%", "Enrollment"], ["+85%", "Lead Quality"], ["8.2×", "ROAS"]],
    quote: "They rebuilt our acquisition system around real enrollment economics.",
  },
  {
    client: "FreshCart E-commerce", industry: "E-commerce", image: "/images/case-commerce.jpg",
    challenge: "A saturated marketplace was compressing margins and limiting repeat purchase growth.",
    metrics: [["3×", "Revenue"], ["+120%", "Repeat Customers"], ["+45%", "AOV Increase"]],
    quote: "For the first time, creative, media and retention worked as one system.",
  },
];

export const reasons: Array<{ title: string; description: string; icon: LucideIcon }> = [
  { title: "AI-First Execution", description: "Intelligent workflows make delivery 3x faster without sacrificing judgment.", icon: BrainCircuit },
  { title: "Data-Driven Growth", description: "Decisions follow evidence, modeled upside and measurable customer behavior.", icon: DatabaseZap },
  { title: "Transparent Reporting", description: "Live dashboards replace opaque PDFs, so you always see what we see.", icon: Activity },
  { title: "Performance Focus", description: "CAC, LTV and pipeline come first. Vanity metrics do not make the agenda.", icon: LineChart },
  { title: "Automation Expertise", description: "We connect marketing, sales and operations into one responsive system.", icon: Workflow },
  { title: "Long-Term Partnerships", description: "Senior operators build durable advantages with your team, not around it.", icon: Handshake },
];

export const processSteps = [
  ["01", "Discovery", "Deep-dive research reveals your market, economics, audience and highest-leverage constraints.", Search],
  ["02", "Strategy", "We define the channel mix, measurement model and prioritized growth roadmap.", Compass],
  ["03", "Execution", "Senior specialists ship creative, campaigns and experiences in focused weekly sprints.", WandSparkles],
  ["04", "Optimization", "Structured experimentation compounds learnings across audience, offer, message and journey.", Bot],
  ["05", "Scale", "Proven wins expand into new audiences, channels and markets without losing efficiency.", Sparkles],
] as const;

export const testimonials = [
  { name: "Priya Sharma", role: "CEO, HealthFirst Clinics", result: "180% Growth", avatar: "PS", quote: "Prime Polo replaced fragmented campaigns with one clear growth system. The commercial impact was visible in our first quarter." },
  { name: "Rajesh Mehta", role: "Founder, EduLearn Academy", result: "310% Enrollment", avatar: "RM", quote: "They understood that more leads were not enough. Better qualification and enrollment economics changed the trajectory." },
  { name: "Ananya Patel", role: "Marketing Director, LuxeStay Hotels", result: "4.2x ROAS", avatar: "AP", quote: "The combination of taste, speed and analytical depth is rare. Every conversation is with a true senior operator." },
  { name: "Vikram Singh", role: "CTO, TechScale Startup", result: "420% MRR", avatar: "VS", quote: "Their team works like our best product squad: fast, accountable and entirely focused on the metric that matters." },
  { name: "Meera Reddy", role: "Founder, FreshCart", result: "3x Revenue", avatar: "MR", quote: "Prime Polo helped us find profitable growth in a crowded category while building a brand customers return to." },
];

export const faqs = [
  ["How quickly can we expect results?", "Most partners see meaningful leading indicators within 30-60 days. The exact timeline depends on your baseline, channel mix and buying cycle. We establish milestones during discovery so expectations stay measurable."],
  ["What makes Prime Polo different?", "We are built like a product team, not a traditional agency: AI-first execution, senior-only staffing, live transparent reporting and commercial metrics such as CAC, LTV and pipeline instead of vanity metrics."],
  ["Do you require long contracts?", "No lock-in is required. We recommend enough time to learn and compound, but flexibility is part of our model. Our 94% retention rate comes from performance and partnership, not contractual friction."],
  ["Which industries do you serve?", "We have category expertise across healthcare, education, real estate, hospitality, e-commerce, startups, professional services and local businesses."],
  ["What budgets do you work with?", "Typical total growth investment ranges from INR 2L to INR 50L+ per month, depending on scope, media requirements and growth stage. We design the right model after a diagnostic conversation."],
  ["Who will actually work on our account?", "Only experienced senior operators. Our roster has a 10+ years experience minimum and we do not hand strategy or execution to junior account teams."],
];

export const team = [
  ["Shaurya Kumar", "Founder & CEO", "SK"],
  ["Marcus Chen", "Head of Strategy", "MC"],
  ["Ines Laurent", "Creative Director", "IL"],
  ["David Okonkwo", "Head of Growth", "DO"],
];