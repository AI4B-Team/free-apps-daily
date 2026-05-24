import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { fetchTodaysApps, subscribe, claimApp } from "@/lib/apps.functions";
import {
  Search, X, Lock, Unlock, Check, Flame, Star,
  ArrowRight, Clock, Crown, Mail, Bell, Zap,
  Filter, ChevronDown, TrendingUp, Users, Gift,
  Rocket, Sparkles, Layers, DollarSign, Shield
} from "lucide-react";

type BadgeKind = "FREE TODAY" | "STAFF PICK" | "WHITE LABEL" | "RESELLABLE" | "NEW" | "OWNED";

const BADGE_STYLES: Record<BadgeKind, string> = {
  "FREE TODAY":  "bg-red-50 text-red-600 border-red-200",
  "STAFF PICK":  "bg-amber-50 text-amber-700 border-amber-200",
  "WHITE LABEL": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "RESELLABLE":  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "NEW":         "bg-sky-50 text-sky-700 border-sky-200",
  "OWNED":       "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
};

function TypeBadge({ kind, dark = false }: { kind: BadgeKind; dark?: boolean }) {
  const darkMap: Record<BadgeKind, string> = {
    "FREE TODAY":  "bg-red-500/15 text-red-300 border-red-500/30",
    "STAFF PICK":  "bg-amber-500/15 text-amber-300 border-amber-500/30",
    "WHITE LABEL": "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    "RESELLABLE":  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    "NEW":         "bg-sky-500/15 text-sky-300 border-sky-500/30",
    "OWNED":       "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  };
  const cls = dark ? darkMap[kind] : BADGE_STYLES[kind];
  return (
    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${cls}`}>
      {kind}
    </span>
  );
}
import heroWoman from "@/assets/hero-woman.png";

const INDUSTRIES = [
  { label: "All Industries", value: "All" },
  { label: "Real Estate",    value: "Real Estate" },
  { label: "Content & Video", value: "Content" },
  { label: "Sales & Marketing", value: "Sales" },
  { label: "Productivity",  value: "Productivity" },
  { label: "Health & Wellness", value: "Health" },
  { label: "Finance",       value: "Finance" },
];

const CATEGORIES = ["All", "Video", "Content", "Real Estate", "Sales", "Productivity", "Health", "Finance"];

// Real company icons via Google's favicon service for accurate live brand assets
const TRUST_LOGOS = [
  { name: "Google",     domain: "google.com" },
  { name: "Notion",     domain: "notion.so" },
  { name: "Shopify",    domain: "shopify.com" },
  { name: "Spotify",    domain: "spotify.com" },
  { name: "Stripe",     domain: "stripe.com" },
  { name: "Slack",      domain: "slack.com" },
  { name: "HubSpot",    domain: "hubspot.com" },
  { name: "Figma",      domain: "figma.com" },
  { name: "Airbnb",     domain: "airbnb.com" },
  { name: "Netflix",    domain: "netflix.com" },
  { name: "Adobe",      domain: "adobe.com" },
  { name: "Amazon",     domain: "amazon.com" },
  { name: "Meta",       domain: "meta.com" },
  { name: "Microsoft",  domain: "microsoft.com" },
  { name: "Uber",       domain: "uber.com" },
  { name: "Tesla",      domain: "tesla.com" },
  { name: "Salesforce", domain: "salesforce.com" },
  { name: "Zoom",       domain: "zoom.us" },
  { name: "Dropbox",    domain: "dropbox.com" },
  { name: "Atlassian",  domain: "atlassian.com" },
  { name: "Asana",      domain: "asana.com" },
  { name: "Canva",      domain: "canva.com" },
  { name: "Trello",     domain: "trello.com" },
  { name: "GitHub",     domain: "github.com" },
  { name: "Linear",     domain: "linear.app" },
  { name: "Intercom",   domain: "intercom.com" },
  { name: "Mailchimp",  domain: "mailchimp.com" },
  { name: "Webflow",    domain: "webflow.com" },
];

const OWNED_APPS = [
  {
    name: "REVVEN",
    tagline: "Your AI Content Empire — White Labeled",
    emoji: "⚡",
    desc: "Launch your own AI content + brand automation SaaS in days, not years. Full source code, your logo, your pricing, your customers.",
    badges: ["OWNED", "WHITE LABEL", "RESELLABLE"] as BadgeKind[],
    price: "From $2,997 one-time",
    margin: "Keep 100% of revenue",
    accent: "from-red-500 to-orange-500",
    icon: Sparkles,
  },
  {
    name: "Real Elite",
    tagline: "Sell Your Own AI CRM to Real Estate Investors",
    emoji: "🏠",
    desc: "A turnkey AI investor CRM you can resell at $97–$497/mo. Lead scoring, deal analysis, bulk offers — all under your brand.",
    badges: ["OWNED", "WHITE LABEL", "RESELLABLE"] as BadgeKind[],
    price: "From $4,997 one-time",
    margin: "Avg reseller MRR: $18K",
    accent: "from-indigo-500 to-purple-600",
    icon: Layers,
  },
  {
    name: "HomesDaily",
    tagline: "Your Own AI Real Estate Marketplace",
    emoji: "🏡",
    desc: "Launch a fully-branded off-market property platform. AI matches buyers to deals, you collect the listing fees and lead-gen revenue.",
    badges: ["OWNED", "RESELLABLE", "STAFF PICK"] as BadgeKind[],
    price: "From $3,497 one-time",
    margin: "$50–$500 per lead",
    accent: "from-emerald-500 to-teal-500",
    icon: Rocket,
  },
];

// Live app shape mapped from the server (field names match the previous hardcoded shape)
type App = {
  id: string;
  name: string;
  cat: string;
  emoji: string;
  offer: string;
  value: number;
  claimed: number;
  featured: boolean;
  ourPick: boolean;
  badges: BadgeKind[];
  desc: string;
  affiliate_url?: string;
};
type Industry = (typeof INDUSTRIES)[number];

const pad = (n: number) => String(n).padStart(2, "0");

export default function FreeAppsDaily() {
  const [heroEmail, setHeroEmail]       = useState("");
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [heroError, setHeroError]       = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [heroIndustryOpen, setHeroIndustryOpen] = useState(false);
  const [activeCat, setActiveCat]       = useState("All");
  const [activeIndustry, setActiveIndustry] = useState<Industry>(INDUSTRIES[0]);
  const [searchQuery, setSearchQuery]   = useState("");
  const [liveQuery, setLiveQuery]       = useState("");
  const [filterOpen, setFilterOpen]     = useState(false);
  const [modalApp, setModalApp]         = useState<App | null>(null);
  const [email, setEmail]               = useState("");
  const [emailError, setEmailError]     = useState(false);
  const [unlocked, setUnlocked]         = useState<string[]>([]);
  const [time, setTime]                 = useState({ h: 11, m: 42, s: 8 });
  const industryRef                     = useRef<HTMLDivElement | null>(null);
  const heroIndustryRef                 = useRef<HTMLDivElement | null>(null);

  const fetchApps = useServerFn(fetchTodaysApps);
  const subscribeFn = useServerFn(subscribe);
  const claimFn = useServerFn(claimApp);

  const { data: APPS = [] } = useQuery({
    queryKey: ["apps", "today"],
    queryFn: async (): Promise<App[]> => {
      const rows = await fetchApps();
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        cat: r.category,
        emoji: r.emoji,
        offer: r.offer,
        value: Math.round(r.value_cents / 100),
        claimed: r.claimed_today,
        featured: r.featured,
        ourPick: r.our_pick,
        badges: r.badges as BadgeKind[],
        desc: r.description,
      }));
    },
    staleTime: 60_000,
  });

  const subscribeMutation = useMutation({
    mutationFn: (vars: { email: string; industry: string; source: string }) =>
      subscribeFn({ data: vars }),
  });

  const claimMutation = useMutation({
    mutationFn: (vars: { email: string; app_id: string }) =>
      claimFn({ data: vars }),
  });

  useEffect(() => {
    const id = setInterval(() => {
      setTime(prev => {
        const { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (industryRef.current && !industryRef.current.contains(e.target as Node)) setIndustryOpen(false);
      if (heroIndustryRef.current && !heroIndustryRef.current.contains(e.target as Node)) setHeroIndustryOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const cdStr = `${pad(time.h)}:${pad(time.m)}:${pad(time.s)}`;

  function selectIndustry(ind: Industry) {
    setActiveIndustry(ind);
    setActiveCat(ind.value);
    setIndustryOpen(false);
    setHeroIndustryOpen(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLiveQuery(searchQuery);
    setActiveCat(activeIndustry.value);
  }

  const filtered = APPS.filter(app => {
    const matchCat = activeCat === "All" || app.cat === activeCat;
    const matchQ   = !liveQuery || app.name.toLowerCase().includes(liveQuery.toLowerCase()) || app.desc.toLowerCase().includes(liveQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const featured = filtered.find(a => a.featured);
  const rest      = filtered.filter(a => !a.featured);
  const isUnlocked = (id: string) => unlocked.includes(id);

  function openModal(app: App) { setModalApp(app); setEmail(""); setEmailError(false); }

  async function claim() {
    if (!email || !email.includes("@")) { setEmailError(true); return; }
    if (!modalApp) return;
    try {
      const res = await claimMutation.mutateAsync({ email, app_id: modalApp.id });
      setUnlocked(prev => [...prev, modalApp.id]);
      setModalApp(null);
      if (res.affiliate_url) window.open(res.affiliate_url, "_blank", "noopener,noreferrer");
    } catch {
      setEmailError(true);
    }
  }

  async function submitHero() {
    if (!heroEmail || !heroEmail.includes("@")) { setHeroError(true); return; }
    try {
      await subscribeMutation.mutateAsync({ email: heroEmail, industry: activeIndustry.value, source: "hero" });
      setHeroSubmitted(true);
      setHeroError(false);
    } catch {
      setHeroError(true);
    }
  }


  return (
    <div className="min-h-screen bg-white text-neutral-900" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Urgency Bar ── */}
      <div className="bg-red-600 text-white text-xs font-semibold text-center py-2 px-4 tracking-widest uppercase flex items-center justify-center gap-2">
        <Clock size={11} />
        All Free Apps Reset In {cdStr} — Claim Yours Before Midnight
      </div>

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-neutral-100 bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse" />
            <span className="text-2xl md:text-3xl font-black tracking-tight text-neutral-900">FreeAppsDaily</span>
          </div>
          <button
            onClick={() => setFilterOpen(o => !o)}
            className="flex items-center gap-1.5 p-2 rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 hover:border-neutral-300 transition-colors"
            aria-label="Search Apps"
          >
            {filterOpen ? <X size={17} /> : <Search size={17} />}
            <ChevronDown size={13} className={`transition-transform ${filterOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative hidden md:block" ref={industryRef}>
            <button
              onClick={() => setIndustryOpen(o => !o)}
              className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <Filter size={13} />
              {activeIndustry.label}
              <ChevronDown size={13} className={`transition-transform ${industryOpen ? "rotate-180" : ""}`} />
            </button>
            {industryOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl py-1.5 w-48 z-50">
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind.value}
                    onClick={() => selectIndustry(ind)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      activeIndustry.value === ind.value
                        ? "text-red-600 font-semibold bg-red-50"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
            <Bell size={12} />
            Get Daily Drops
          </button>
        </div>
      </nav>

      {/* ── Nav Search Drawer ── */}
      {filterOpen && (
        <div className="border-b border-neutral-100 bg-neutral-50 px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-2.5 flex-1 shadow-sm">
              <Search size={14} className="text-neutral-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search apps by name, category, or use case..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-neutral-900 placeholder-neutral-400 outline-none"
              />
            </div>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 rounded-xl transition-colors">
              Search
            </button>
          </form>
          <div className="flex gap-2 flex-wrap mt-3 max-w-2xl mx-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCat(cat); setLiveQuery(""); }}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                  activeCat === cat
                    ? "bg-red-600 border-red-600 text-white"
                    : "border-neutral-200 text-neutral-500 hover:border-neutral-400 bg-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── HERO SECTION ── */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-red-50 px-8 pt-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                <Zap size={11} className="fill-red-600" />
                {APPS.length} Free AI Apps Available Today
              </div>

              <h1 className="text-5xl font-black leading-[1.08] text-neutral-900 mb-5 tracking-tight">
                The Best AI Apps.<br />
                <span className="text-red-600">Free. Every Day.</span>
              </h1>

              <p className="text-base text-neutral-500 leading-relaxed mb-8 max-w-md">
                Join 47,218 entrepreneurs discovering and claiming free AI tools daily — curated by The AI For Business Team.
              </p>

              {heroSubmitted ? (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-5 py-4 rounded-xl max-w-md">
                  <Check size={16} />
                  You're In! Check Your Inbox For Today's Free Apps.
                </div>
              ) : (
                <>
                  <div className="flex gap-3 max-w-md mb-2">
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      value={heroEmail}
                      onChange={e => { setHeroEmail(e.target.value); setHeroError(false); }}
                      className={`flex-1 bg-white border rounded-xl px-4 py-3.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none shadow-sm transition-colors ${
                        heroError ? "border-red-400" : "border-neutral-200 focus:border-red-300"
                      }`}
                    />
                    <button
                      onClick={submitHero}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-black px-6 py-3.5 rounded-xl transition-colors shadow-sm whitespace-nowrap"
                    >
                      Get Free Apps →
                    </button>
                  </div>
                  {heroError && <p className="text-xs text-red-500 mb-1">Please Enter A Valid Email Address.</p>}
                  <p className="text-xs text-neutral-400">No Credit Card · 47,218 Subscribers · Unsubscribe Anytime</p>
                </>
              )}

              <div className="flex items-center gap-4 mt-7">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Users size={12} className="text-red-500" />
                  <span><strong className="text-neutral-800">47K+</strong> Subscribers</span>
                </div>
                <div className="w-px h-4 bg-neutral-200" />
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Gift size={12} className="text-red-500" />
                  <span><strong className="text-neutral-800">$400+</strong> Value Free Today</span>
                </div>
                <div className="w-px h-4 bg-neutral-200" />
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <TrendingUp size={12} className="text-red-500" />
                  <span><strong className="text-neutral-800">61%</strong> Open Rate</span>
                </div>
              </div>
            </div>

            {/* ── Hero Image + Floating Cards ── */}
            <div className="relative h-[480px] flex items-center justify-center select-none">
              <div className="absolute w-80 h-80 rounded-full bg-red-100 opacity-50" style={{ filter: "blur(60px)" }} />

              <img
                src={heroWoman}
                alt="Entrepreneur celebrating free AI app access on her laptop"
                width={1024}
                height={1024}
                className="relative z-10 max-h-[480px] w-auto object-contain drop-shadow-xl"
              />

              {/* Floating: REVVEN — top left */}
              <div className="absolute top-6 left-0 z-20 bg-white border border-neutral-200 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <Zap size={16} className="text-white fill-white" />
                </div>
                <div>
                  <div className="text-xs font-black text-neutral-900">REVVEN</div>
                  <div className="text-[11px] text-green-600 font-bold">Free Access</div>
                </div>
              </div>

              {/* Floating: 47K Subscribers — top right */}
              <div className="absolute top-2 right-0 z-20 bg-white border border-neutral-200 rounded-2xl px-4 py-3 shadow-xl">
                <div className="text-lg font-black text-red-600 leading-none">47K+</div>
                <div className="text-[11px] text-neutral-500 font-semibold mt-1">Subscribers</div>
              </div>

              {/* Floating: Descript Pro — mid right */}
              <div className="absolute top-1/2 -right-2 z-20 bg-white border border-neutral-200 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                  <Star size={16} className="text-red-600 fill-red-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-neutral-900">Descript Pro</div>
                  <div className="text-[11px] text-red-500 font-bold">14-Day Free</div>
                </div>
              </div>

              {/* Floating: 12 Apps Free — bottom left */}
              <div className="absolute bottom-16 left-2 z-20 bg-white border border-neutral-200 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <Gift size={16} className="text-red-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-neutral-900">12 Apps Free</div>
                  <div className="text-[11px] text-neutral-500 font-semibold">Today Only</div>
                </div>
              </div>

              {/* Floating: Real Elite — bottom right */}
              <div className="absolute bottom-8 right-4 z-20 bg-white border border-neutral-200 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <Crown size={16} className="text-red-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-neutral-900">Real Elite</div>
                  <div className="text-[11px] text-green-600 font-bold">Free Trial</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hero Search Bar (overlaps hero + trust band) ── */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-[calc(100%-4rem)] max-w-6xl px-4 z-30">
          <form
            onSubmit={handleSearch}
            className="bg-white border border-neutral-200 rounded-2xl p-3 shadow-2xl flex items-center gap-3"
          >
            <div className="relative" ref={heroIndustryRef}>
              <button
                type="button"
                onClick={() => setHeroIndustryOpen(o => !o)}
                className="flex items-center gap-2 text-sm text-neutral-700 font-medium border-r border-neutral-200 pr-4 py-1 hover:text-red-600 transition-colors min-w-max"
              >
                <Filter size={14} className="text-neutral-400" />
                {activeIndustry.label}
                <ChevronDown size={13} className={`text-neutral-400 transition-transform ${heroIndustryOpen ? "rotate-180" : ""}`} />
              </button>
              {heroIndustryOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl py-1.5 w-48 z-50">
                  {INDUSTRIES.map(ind => (
                    <button
                      key={ind.value}
                      type="button"
                      onClick={() => selectIndustry(ind)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        activeIndustry.value === ind.value
                          ? "text-red-600 font-semibold bg-red-50"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      {ind.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center gap-2 px-2">
              <Search size={15} className="text-neutral-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by app name, feature, or use case..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-sm text-neutral-900 placeholder-neutral-400 outline-none bg-transparent"
              />
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(""); setLiveQuery(""); }} className="text-neutral-400 hover:text-neutral-700">
                  <X size={13} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-7 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Trust / Logo Bar ── */}
      <div className="border-t border-b border-neutral-200 bg-white pt-20 pb-10 overflow-hidden relative group">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[...TRUST_LOGOS, ...TRUST_LOGOS].map((logo, i) => (
            <img
              key={`${logo.domain}-${i}`}
              src={`https://www.google.com/s2/favicons?domain=${logo.domain}&sz=128`}
              alt={logo.name}
              className="h-12 w-12 mx-8 md:mx-10 opacity-95 hover:opacity-100 transition-opacity shrink-0 object-contain"
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-8 py-10">

        {featured && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Crown size={13} className="text-red-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-600">Featured App Of The Day</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 border border-red-200 rounded-2xl p-6 bg-white relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-600" />
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Flame size={10} /> {featured.claimed.toLocaleString()} Claimed
                </div>
                <div className="flex items-start gap-4 mb-5 pr-28">
                  <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-2xl flex-shrink-0">{featured.emoji}</div>
                  <div>
                    <h2 className="text-xl font-bold mb-1 text-neutral-900">{featured.name}</h2>
                    <p className="text-sm text-neutral-500 leading-relaxed">{featured.desc}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 mb-5 flex-wrap items-center">
                  {featured.badges.map(b => <TypeBadge key={b} kind={b} />)}
                  <span className="text-xs bg-neutral-100 text-neutral-500 px-2.5 py-0.5 rounded-full border border-neutral-200">{featured.cat}</span>
                  <span className="text-xs border border-neutral-200 bg-neutral-50 text-neutral-500 px-2.5 py-0.5 rounded-full font-medium">{featured.offer}</span>
                  <span className="text-xs bg-neutral-100 text-neutral-400 px-2.5 py-0.5 rounded-full border border-neutral-200">Normally ${featured.value}/mo</span>
                </div>
                {isUnlocked(featured.id) ? (
                  <div className="w-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                    <Check size={14} /> Access Unlocked — Check Your Email
                  </div>
                ) : (
                  <button onClick={() => openModal(featured)} className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Lock size={14} /> Unlock Free Access — Enter Email
                  </button>
                )}
                <p className="text-xs text-neutral-400 text-center mt-2">No Credit Card · Resets At Midnight</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-1.5"><Clock size={11} /> Offer Expires In</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {([["Hrs", time.h], ["Min", time.m], ["Sec", time.s]] as const).map(([lbl, val]) => (
                      <div key={lbl} className="bg-neutral-50 border border-neutral-200 rounded-lg py-2.5 text-center">
                        <span className="block text-xl font-bold text-red-600">{pad(val)}</span>
                        <span className="text-xs text-neutral-400 uppercase tracking-wider">{lbl}</span>
                      </div>
                    ))}
                  </div>
                  {[["Today's Apps", `${APPS.length} Free Drops`], ["Total Value", "$400+ Saved"], ["Subscribers", "47,218"], ["Open Rate", "61%"]].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-xs border-t border-neutral-100 py-2">
                      <span className="text-neutral-400">{label}</span>
                      <span className="font-semibold text-neutral-800">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1 flex items-center gap-1.5"><Bell size={11} /> Never Miss A Drop</p>
                  <p className="text-xs text-neutral-400 mb-3 leading-relaxed">All free apps to your inbox before 8am daily.</p>
                  <input type="email" placeholder="your@email.com" className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none mb-2" />
                  <button className="w-full bg-black hover:bg-neutral-800 text-white text-xs font-bold py-2.5 rounded-lg transition-colors">Subscribe Free →</button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap size={13} className="text-red-600" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-800">Today's Free Apps</h2>
            </div>
            <span className="text-xs text-neutral-400">{rest.length} Available Now</span>
          </div>
          {rest.length === 0 ? (
            <div className="text-center py-16 text-neutral-400 text-sm border border-neutral-100 rounded-2xl">
              No Apps Match That Search. Try A Different Industry Or Keyword.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map(app => (
                <div key={app.id} className="border border-neutral-200 hover:border-neutral-300 hover:shadow-md rounded-xl p-4 bg-white flex flex-col transition-all shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-lg flex-shrink-0">{app.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-bold truncate text-neutral-900">{app.name}</span>
                        {app.ourPick && <Star size={10} className="text-red-500 fill-red-500 flex-shrink-0" />}
                      </div>
                      <span className="text-xs text-neutral-400">{app.cat}</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-3 flex-1">{app.desc}</p>
                  <div className="flex gap-1 mb-3 flex-wrap">
                    {app.badges.map(b => <TypeBadge key={b} kind={b} />)}
                    {app.value > 0 && <span className="text-[10px] border border-neutral-200 bg-neutral-50 text-neutral-400 px-2 py-0.5 rounded-full">${app.value}/mo value</span>}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    {isUnlocked(app.id) ? (
                      <div className="flex-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5">
                        <Check size={11} /> Unlocked
                      </div>
                    ) : (
                      <button onClick={() => openModal(app)} className="flex-1 bg-black hover:bg-neutral-800 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                        <Lock size={11} /> Unlock Free
                      </button>
                    )}
                    <span className="text-xs text-neutral-300 whitespace-nowrap flex-shrink-0">{app.claimed.toLocaleString()} claimed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* ── LAUNCH YOUR OWN AI BUSINESS (Premium Dark) ── */}
      <section className="relative bg-neutral-950 text-white overflow-hidden mt-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.18),transparent_55%)] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-8 py-20">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-red-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5 backdrop-blur">
              <Rocket size={11} />
              For Founders, Operators & Agencies
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.05]">
              Don't Just Use AI Apps.<br />
              <span className="bg-gradient-to-r from-red-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                Launch Your Own AI Business.
              </span>
            </h2>
            <p className="text-base text-neutral-400 leading-relaxed">
              Stop renting tools. Own them. Our white-label AI platforms let you launch a real software business —
              your brand, your pricing, 100% of the revenue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {OWNED_APPS.map(app => {
              const Icon = app.icon;
              return (
                <div
                  key={app.name}
                  className="group relative bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-white/25 rounded-2xl p-6 flex flex-col transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/10 backdrop-blur-sm"
                >
                  <div className={`absolute -top-px left-6 right-6 h-px bg-gradient-to-r ${app.accent} opacity-60`} />

                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.accent} flex items-center justify-center shadow-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="text-3xl">{app.emoji}</span>
                  </div>

                  <h3 className="text-2xl font-black mb-1.5 text-white">{app.name}</h3>
                  <p className="text-sm font-semibold text-neutral-300 mb-3 leading-snug">{app.tagline}</p>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-5 flex-1">{app.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {app.badges.map(b => <TypeBadge key={b} kind={b} dark />)}
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-xs">
                      <DollarSign size={12} className="text-emerald-400" />
                      <span className="text-neutral-400">License:</span>
                      <span className="font-bold text-white">{app.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp size={12} className="text-emerald-400" />
                      <span className="text-neutral-400">Upside:</span>
                      <span className="font-bold text-white">{app.margin}</span>
                    </div>
                  </div>

                  <button className={`w-full bg-gradient-to-r ${app.accent} text-white text-sm font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg`}>
                    Get Licensing Details <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500">
            <div className="flex items-center gap-1.5"><Shield size={12} className="text-emerald-400" /> Source code included</div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5"><Layers size={12} className="text-indigo-400" /> Full white-label rights</div>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5"><Sparkles size={12} className="text-amber-400" /> Launch in under 14 days</div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-8 py-10">

        <section className="mt-8 bg-black rounded-2xl p-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Mail size={13} className="text-red-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">The AI Stack Drop</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Every Free App. Every Morning.</h3>
          <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto leading-relaxed">
            Curated By The AI For Business Team
            <br />
            47,218 Subscribers & Counting
          </p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none" />
            <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg whitespace-nowrap transition-colors">Subscribe →</button>
          </div>
          <p className="text-xs text-neutral-600 mt-3">No Spam · 61% Open Rate · Unsubscribe Anytime</p>
        </section>
      </div>

      {modalApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setModalApp(null)}>
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 w-full max-w-sm relative shadow-xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalApp(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors"><X size={16} /></button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xl">{modalApp.emoji}</div>
              <div>
                <div className="text-sm font-bold text-neutral-900">{modalApp.name}</div>
                <div className="text-xs text-red-600 font-semibold">{modalApp.offer}</div>
              </div>
            </div>
            <h3 className="text-base font-bold mb-1 text-neutral-900">Unlock Free Access</h3>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">Enter your email to claim free access and join 47,000+ entrepreneurs getting daily AI drops.</p>
            <input
              type="email" placeholder="your@email.com" value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(false); }}
              className={`w-full bg-neutral-50 border rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 outline-none mb-3 transition-colors ${emailError ? "border-red-400" : "border-neutral-200 focus:border-neutral-400"}`}
            />
            {emailError && <p className="text-xs text-red-500 mb-2 -mt-1">Please Enter A Valid Email Address.</p>}
            <button onClick={claim} className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mb-3">
              <Unlock size={14} /> Claim Free Access
            </button>
            <button onClick={() => setModalApp(null)} className="block w-full text-center text-xs text-neutral-400 hover:text-neutral-600 transition-colors">No Thanks</button>
          </div>
        </div>
      )}
    </div>
  );
}
