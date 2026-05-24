import { Sparkles, Layers, Rocket, type LucideIcon } from "lucide-react";

export type OwnershipBadge = "OWNED" | "RESELLABLE" | "VERIFIED" | "BRANDABLE" | "STAFF PICK";

export type InstantApp = {
  slug: string;
  name: string;
  tagline: string;
  emoji: string;
  desc: string;
  badges: OwnershipBadge[];
  price: string;
  ownership: string;
  accent: string;
  /** 5-color icon palette unique to this app */
  palette: string[];
  icon: LucideIcon;
  // Landing page extras
  headline: string;
  subheadline: string;
  hero: {
    eyebrow: string;
    bullets: string[];
  };
  opportunity: {
    title: string;
    body: string;
    points: string[];
  };
  audience: string[];
  businessModels: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  testimonials: { quote: string; name: string; role: string }[];
  metrics: { label: string; value: string }[];
};

const COMMON_AUDIENCE = ["Agencies", "Entrepreneurs", "Coaches", "Creators", "Operators", "Investors"];

const COMMON_MODELS = [
  { title: "SaaS Subscriptions", desc: "Recurring monthly or annual plans under your brand." },
  { title: "Agency Services", desc: "Bundle the platform into productized client offers." },
  { title: "Lead Generation", desc: "Generate and qualify leads, sell access or data." },
  { title: "Enterprise Licensing", desc: "License the platform to larger orgs at custom rates." },
  { title: "Membership Access", desc: "Gate access behind a community or course membership." },
];

const COMMON_FAQS = [
  { q: "Do I really own the platform?", a: "Yes. You receive full white-label rights to deploy, brand, and monetize under your own company. We do not take a revenue share." },
  { q: "Do I need to code?", a: "No. Deployment is handled through a guided setup. Branding, pricing, and domains are configured in your admin dashboard." },
  { q: "Can I keep 100% of the revenue?", a: "Yes. Whatever you charge your customers stays with you. We only collect the one-time licensing fee." },
  { q: "What's included in the license?", a: "Full source rights, billing infrastructure, AI workflows, admin dashboard, deployment system, and marketing assets." },
  { q: "How long does it take to launch?", a: "Most operators are live with their own branded platform in under a week." },
  { q: "Is there ongoing support?", a: "Yes. Licensees get access to updates, a private operator community, and direct support." },
];

export const INSTANT_APPS: InstantApp[] = [
  {
    slug: "revven",
    name: "REVVEN",
    tagline: "Your AI Content Empire — White Labeled",
    emoji: "⚡",
    desc: "Launch your own AI content + brand automation SaaS in days, not years. Full source code, your logo, your pricing, your customers.",
    badges: ["RESELLABLE", "BRANDABLE"],
    price: "Starts At $2,997",
    ownership: "Full Resell Rights Included",
    accent: "from-red-500 to-orange-500",
    palette: ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-rose-500", "bg-yellow-500"],
    icon: Sparkles,
    headline: "Launch your own AI content company",
    subheadline: "Launch a fully-branded AI-powered content platform under your own name, pricing, and domain in minutes instead of years.",
    hero: {
      eyebrow: "AI Content Platform · White-Label",
      bullets: ["Full Resell Rights", "Your Branding", "Keep 100% Of Revenue", "No Coding Required"],
    },
    opportunity: {
      title: "Stop renting software. Own it.",
      body: "Most operators rent software from someone else and rebuild the same audience over and over. REVVEN flips the model — you own the platform, set the pricing, and keep every dollar of recurring revenue.",
      points: [
        "Own the platform end-to-end",
        "Brand it under your company",
        "Set your own pricing tiers",
        "Deploy on your custom domain",
        "Monetize recurring subscriptions",
      ],
    },
    audience: COMMON_AUDIENCE,
    businessModels: COMMON_MODELS,
    faqs: COMMON_FAQS,
    testimonials: [
      { quote: "We launched our own branded AI content SaaS in a weekend. First paying customer in week two.", name: "Maya Chen", role: "Agency Owner" },
      { quote: "Replaced three tools in our stack and started reselling it to our coaching clients.", name: "Devon Pierce", role: "Operator" },
    ],
    metrics: [
      { label: "Operators Launched", value: "1,240+" },
      { label: "Avg. Time To Launch", value: "6 Days" },
      { label: "Avg. Recurring Plan", value: "$147/mo" },
    ],
  },
  {
    slug: "real-elite",
    name: "Real Elite",
    tagline: "Sell Your Own AI CRM to Real Estate Investors",
    emoji: "🏠",
    desc: "A turnkey AI investor CRM you can resell at $97–$497/mo. Lead scoring, deal analysis, bulk offers — all under your brand.",
    badges: ["RESELLABLE", "VERIFIED"],
    price: "Starts At $4,997",
    ownership: "Launch Under Your Brand",
    accent: "from-indigo-500 to-purple-600",
    palette: ["bg-indigo-500", "bg-violet-500", "bg-sky-500", "bg-blue-500", "bg-cyan-500"],
    icon: Layers,
    headline: "Launch your own AI investor CRM",
    subheadline: "A complete white-label CRM you can launch under your brand and sell to investors, agents, and wholesalers in any market.",
    hero: {
      eyebrow: "AI CRM · Real Estate",
      bullets: ["Full Resell Rights", "Your Branding", "Keep 100% Of Revenue", "No Coding Required"],
    },
    opportunity: {
      title: "Stop renting software. Own it.",
      body: "Investor CRMs charge $97–$497 per month per seat. With Real Elite, you become the platform — not the customer.",
      points: [
        "Own a full investor CRM",
        "Resell to wholesalers and agents",
        "Bundle into agency retainers",
        "Custom domain + email branding",
        "Recurring subscription billing built in",
      ],
    },
    audience: COMMON_AUDIENCE,
    businessModels: COMMON_MODELS,
    faqs: COMMON_FAQS,
    testimonials: [
      { quote: "Launched in our market and onboarded a 40-seat brokerage in the first month.", name: "Carlos Rivera", role: "Broker / Operator" },
    ],
    metrics: [
      { label: "Markets Live", value: "180+" },
      { label: "Seats Under Mgmt", value: "12,400+" },
      { label: "Avg. Seat Price", value: "$197/mo" },
    ],
  },
  {
    slug: "homesdaily",
    name: "HomesDaily",
    tagline: "Your Own AI Real Estate Marketplace",
    emoji: "🏡",
    desc: "Launch a fully-branded off-market property platform. AI matches buyers to deals, you collect the listing fees and lead-gen revenue.",
    badges: ["RESELLABLE", "STAFF PICK"],
    price: "Starts At $3,497",
    ownership: "Own Your Customer Base",
    accent: "from-emerald-500 to-teal-500",
    palette: ["bg-emerald-500", "bg-teal-500", "bg-lime-500", "bg-green-600", "bg-cyan-600"],
    icon: Rocket,
    headline: "Launch your own AI real estate marketplace",
    subheadline: "Own a branded off-market property platform where AI matches buyers to deals — and you collect every listing and lead-gen fee.",
    hero: {
      eyebrow: "Marketplace · AI Matching",
      bullets: ["Full Resell Rights", "Your Branding", "Keep 100% Of Revenue", "No Coding Required"],
    },
    opportunity: {
      title: "Stop renting software. Own it.",
      body: "Marketplaces compound. Every buyer and every listing makes the platform more valuable — and the platform is yours.",
      points: [
        "Own a two-sided marketplace",
        "Charge listing and lead fees",
        "Brand the entire buyer experience",
        "Custom domain + native mobile feel",
        "AI matching built in",
      ],
    },
    audience: COMMON_AUDIENCE,
    businessModels: COMMON_MODELS,
    faqs: COMMON_FAQS,
    testimonials: [
      { quote: "We replaced our static listings site and added a real revenue line in 30 days.", name: "Priya Naidu", role: "Marketplace Operator" },
    ],
    metrics: [
      { label: "Listings Indexed", value: "82K+" },
      { label: "Active Buyers", value: "19,800+" },
      { label: "Avg. Listing Fee", value: "$249" },
    ],
  },
];

export function getInstantApp(slug: string): InstantApp | undefined {
  return INSTANT_APPS.find(a => a.slug === slug);
}
