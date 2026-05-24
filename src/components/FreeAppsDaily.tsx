import { useState, useEffect, useRef } from "react";
import {
  Search, X, Lock, Unlock, Check, Flame, Star,
  ArrowRight, Clock, Crown, Mail, Bell, Zap,
  Filter, ChevronDown, TrendingUp, Users, Gift
} from "lucide-react";
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

// Real company logos via simple-icons CDN (monochrome SVG)
const TRUST_LOGOS = [
  { name: "Google",  slug: "google" },
  { name: "Notion",  slug: "notion" },
  { name: "Shopify", slug: "shopify" },
  { name: "Spotify", slug: "spotify" },
  { name: "Stripe",  slug: "stripe" },
  { name: "Slack",   slug: "slack" },
  { name: "HubSpot", slug: "hubspot" },
];

const APPS = [
  { id: 1,  name: "Descript Pro",    cat: "Video",        emoji: "🎬", offer: "14-Day Pro Free",    value: 24,  claimed: 847,  featured: true,  ourPick: false, desc: "AI video editor — remove filler words, clone your voice, and publish everywhere in one click." },
  { id: 2,  name: "Real Elite",      cat: "Real Estate",  emoji: "🏠", offer: "Free Trial",          value: 97,  claimed: 312,  featured: false, ourPick: true,  desc: "AI-powered investor CRM — auto-score leads, analyze deals, and submit bulk offers from one dashboard." },
  { id: 3,  name: "REVVEN",          cat: "Content",      emoji: "⚡", offer: "Free Access",          value: 79,  claimed: 198,  featured: false, ourPick: true,  desc: "Create content, automate your brand, and monetize — the AI business suite built for entrepreneurs." },
  { id: 4,  name: "Copy.ai",         cat: "Content",      emoji: "✍️", offer: "7-Day Pro Free",       value: 49,  claimed: 521,  featured: false, ourPick: false, desc: "Generate sales copy, email sequences, and social content in seconds with 90+ templates." },
  { id: 5,  name: "Gamma.app",       cat: "Productivity", emoji: "📊", offer: "Free Starter",         value: 15,  claimed: 634,  featured: false, ourPick: false, desc: "AI-generated presentations and documents — build a full deck in under 60 seconds." },
  { id: 6,  name: "Perplexity Pro",  cat: "Productivity", emoji: "🧠", offer: "1-Month Pro Free",     value: 20,  claimed: 1203, featured: false, ourPick: false, desc: "AI-powered research engine with real-time web search, citations, and deep document analysis." },
  { id: 7,  name: "Instantly.ai",    cat: "Sales",        emoji: "📧", offer: "Free Trial",           value: 37,  claimed: 289,  featured: false, ourPick: false, desc: "Cold email platform with AI warmup, sequence builder, and inbox rotation at scale." },
  { id: 8,  name: "ElevenLabs",      cat: "Content",      emoji: "🎙️", offer: "Free Tier Unlocked",   value: 22,  claimed: 472,  featured: false, ourPick: false, desc: "Hyper-realistic AI voice cloning and text-to-speech in 29 languages." },
  { id: 9,  name: "Midjourney Lite", cat: "Content",      emoji: "🎨", offer: "200 Free Images",      value: 10,  claimed: 918,  featured: false, ourPick: false, desc: "The world's leading AI image generator — cinematic, photorealistic, and endlessly creative." },
  { id: 10, name: "Otter.ai Pro",    cat: "Productivity", emoji: "📝", offer: "30-Day Pro Free",      value: 17,  claimed: 341,  featured: false, ourPick: false, desc: "AI meeting transcription, auto-summaries, and action items delivered instantly after every call." },
  { id: 11, name: "Zapier AI",       cat: "Productivity", emoji: "🔗", offer: "Free Zaps Pack",       value: 29,  claimed: 567,  featured: false, ourPick: false, desc: "Automate 6,000+ apps with AI-built workflows — no code, no developers, no limits." },
  { id: 12, name: "HomesDaily",      cat: "Real Estate",  emoji: "🏡", offer: "Buyer Access Free",    value: 0,   claimed: 144,  featured: false, ourPick: true,  desc: "AI-powered real estate marketplace — find off-market deals, motivated sellers, and distressed properties." },
];

type App = (typeof APPS)[number];
type Industry = (typeof INDUSTRIES)[number];

const pad = (n: number) => String(n).padStart(2, "0");

export default function FreeAppsDaily() {
  const [heroEmail, setHeroEmail]       = useState("");
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [heroError, setHeroError]       = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [activeCat, setActiveCat]       = useState("All");
  const [activeIndustry, setActiveIndustry] = useState<Industry>(INDUSTRIES[0]);
  const [searchQuery, setSearchQuery]   = useState("");
  const [liveQuery, setLiveQuery]       = useState("");
  const [filterOpen, setFilterOpen]     = useState(false);
  const [modalApp, setModalApp]         = useState<App | null>(null);
  const [email, setEmail]               = useState("");
  const [emailError, setEmailError]     = useState(false);
  const [unlocked, setUnlocked]         = useState<number[]>([]);
  const [time, setTime]                 = useState({ h: 11, m: 42, s: 8 });
  const industryRef                     = useRef<HTMLDivElement | null>(null);

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
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const cdStr = `${pad(time.h)}:${pad(time.m)}:${pad(time.s)}`;

  function selectIndustry(ind: Industry) {
    setActiveIndustry(ind);
    setActiveCat(ind.value);
    setIndustryOpen(false);
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
  const isUnlocked = (id: number) => unlocked.includes(id);

  function openModal(app: App) { setModalApp(app); setEmail(""); setEmailError(false); }

  function claim() {
    if (!email || !email.includes("@")) { setEmailError(true); return; }
    if (!modalApp) return;
    setUnlocked(prev => [...prev, modalApp.id]);
    setModalApp(null);
  }

  function submitHero() {
    if (!heroEmail || !heroEmail.includes("@")) { setHeroError(true); return; }
    setHeroSubmitted(true);
    setHeroError(false);
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Urgency Bar ── */}
      <div className="bg-red-600 text-white text-xs font-semibold text-center py-2 px-4 tracking-widest uppercase flex items-center justify-center gap-2">
        <Clock size={11} />
        All Free Apps Reset In {cdStr} — Claim Yours Before Midnight
      </div>

      {/* ── Nav ── */}
      <nav className="flex items-center gap-6 px-8 py-3 border-b border-neutral-100 bg-white sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-sm font-black tracking-tight text-neutral-900">FreeAppsDaily</span>
        </div>

        {/* Inline nav search — pill shaped */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="flex items-center gap-2 bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-neutral-300 focus-within:bg-white focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-100 rounded-full pl-4 pr-2 py-2 transition-all">
            <Search size={15} className="text-neutral-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search apps, categories, or use cases…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-neutral-800 placeholder-neutral-400 outline-none min-w-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setLiveQuery(""); }}
                className="text-neutral-400 hover:text-neutral-700 p-1"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-semibold text-neutral-400 bg-white border border-neutral-200 rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </div>
        </form>

        <div className="flex items-center gap-5 flex-shrink-0">
          <div className="relative hidden md:block" ref={industryRef}>
            <button
              onClick={() => setIndustryOpen(o => !o)}
              className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <Filter size={13} />
              {activeIndustry.label}
              <ChevronDown size={13} className={`transition-transform ${industryOpen ? "rotate-180" : ""}`} />
            </button>
            {industryOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl py-1.5 w-48 z-50">
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

          <button className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap">
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


              {/* Floating: Descript Pro — mid right */}
              <div className="absolute top-1/2 -right-2 z-20 bg-white border border-neutral-200 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-lg">🎬</div>
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
                <span className="text-lg">🏠</span>
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
            <div className="relative">
              <button
                type="button"
                onClick={() => setIndustryOpen(o => !o)}
                className="flex items-center gap-2 text-sm text-neutral-700 font-medium border-r border-neutral-200 pr-4 py-1 hover:text-red-600 transition-colors min-w-max"
              >
                <Filter size={14} className="text-neutral-400" />
                {activeIndustry.label}
                <ChevronDown size={13} className={`text-neutral-400 transition-transform ${industryOpen ? "rotate-180" : ""}`} />
              </button>
              {industryOpen && (
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

      {/* ── Trust / Logo Bar (search bar floats on this top border) ── */}
      <div className="border-t border-b border-neutral-200 bg-white pt-20 pb-10 px-8">

        <div className="max-w-5xl mx-auto flex items-center gap-8 md:gap-14 flex-wrap justify-center">
          {TRUST_LOGOS.map(logo => (
            <img
              key={logo.slug}
              src={`https://cdn.simpleicons.org/${logo.slug}/9ca3af`}
              alt={logo.name}
              className="h-7 w-auto opacity-70 hover:opacity-100 transition-opacity grayscale"
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
                <div className="flex gap-2 mb-5 flex-wrap">
                  <span className="text-xs bg-neutral-100 text-neutral-500 px-3 py-1 rounded-full border border-neutral-200">{featured.cat}</span>
                  <span className="text-xs border border-red-200 bg-red-50 text-red-600 px-3 py-1 rounded-full font-semibold">{featured.offer}</span>
                  <span className="text-xs bg-neutral-100 text-neutral-400 px-3 py-1 rounded-full border border-neutral-200">Normally ${featured.value}/mo</span>
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
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    <span className="text-xs border border-red-200 bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">{app.offer}</span>
                    {app.value > 0 && <span className="text-xs border border-neutral-200 bg-neutral-50 text-neutral-400 px-2 py-0.5 rounded-full">${app.value}/mo value</span>}
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

        <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-red-200 bg-red-50 hover:bg-red-100 rounded-2xl p-6 cursor-pointer transition-colors group">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2 block">Creators & Agencies</span>
            <h3 className="text-base font-bold mb-2 text-neutral-900">Create. Automate. Monetize.</h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-4">REVVEN gives you AI content creation, brand automation, and a full business suite — all in one platform.</p>
            <div className="flex items-center gap-1 text-sm font-bold text-red-600 group-hover:gap-2.5 transition-all">
              <span>Explore REVVEN</span><ArrowRight size={14} />
            </div>
          </div>
          <div className="border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 rounded-2xl p-6 cursor-pointer transition-colors group">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2 block">Real Estate Investors</span>
            <h3 className="text-base font-bold mb-2 text-neutral-900">Find. Analyze. Close.</h3>
            <p className="text-sm text-neutral-500 leading-relaxed mb-4">Real Elite is the AI CRM built for serious investors — automated scoring, deal analysis, and bulk offers.</p>
            <div className="flex items-center gap-1 text-sm font-bold text-neutral-800 group-hover:gap-2.5 transition-all">
              <span>Explore Real Elite</span><ArrowRight size={14} />
            </div>
          </div>
        </section>

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
