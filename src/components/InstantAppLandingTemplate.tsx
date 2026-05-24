import { Link } from "@tanstack/react-router";
import {
  ArrowRight, Play, Check, Sparkles, Layers, Rocket, DollarSign,
  Shield, Crown, Palette, Globe, Mail, CreditCard, LayoutDashboard,
  Megaphone, Cpu, Server, Star, Users, Briefcase, Target,
  TrendingUp, Building2, GraduationCap, UserCircle,
} from "lucide-react";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import type { InstantApp, OwnershipBadge } from "@/data/instant-apps";

const BADGE_DARK: Record<OwnershipBadge, string> = {
  OWNED:       "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  RESELLABLE:  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  VERIFIED:    "bg-sky-500/15 text-sky-300 border-sky-500/30",
  BRANDABLE:   "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  "STAFF PICK":"bg-amber-500/15 text-amber-300 border-amber-500/30",
};

const INCLUDED = [
  { icon: Crown,           title: "Full White-Label Rights",  desc: "Your brand. Your domain. Your customers." },
  { icon: CreditCard,      title: "Billing Infrastructure",   desc: "Subscriptions, trials, invoices, taxes." },
  { icon: Cpu,             title: "AI Workflows",             desc: "Production-ready AI pipelines included." },
  { icon: Server,          title: "Deployment System",        desc: "One-click deploy to your infrastructure." },
  { icon: LayoutDashboard, title: "Admin Dashboard",          desc: "Full operator control panel." },
  { icon: Megaphone,       title: "Marketing Assets",         desc: "Landing pages, emails, ad creatives." },
  { icon: Palette,         title: "Custom Branding",          desc: "Logos, colors, typography, themes." },
  { icon: Shield,          title: "Subscription Management",  desc: "Lifecycle, dunning, retention built-in." },
];

const AUDIENCE_ICONS: Record<string, typeof Briefcase> = {
  Agencies: Briefcase,
  Entrepreneurs: Rocket,
  Coaches: GraduationCap,
  Creators: Sparkles,
  Operators: Target,
  Investors: TrendingUp,
};

const CUSTOMIZATION = [
  { icon: Crown,   title: "Custom Logos" },
  { icon: Palette, title: "Custom Colors" },
  { icon: Globe,   title: "Custom Domains" },
  { icon: UserCircle, title: "Custom Onboarding" },
  { icon: DollarSign, title: "Custom Pricing" },
  { icon: Mail,    title: "Branded Emails" },
];

function MockBrowser({ accent }: { accent: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl shadow-black/50">
      <div className="flex items-center gap-1.5 px-4 py-3 bg-neutral-900 border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-[11px] text-neutral-500 font-mono">yourbrand.com</span>
      </div>
      <div className={`aspect-[16/10] bg-gradient-to-br ${accent} relative`}>
        <div className="absolute inset-0 bg-neutral-950/70" />
        <div className="absolute inset-0 p-6 grid grid-cols-12 gap-3">
          <div className="col-span-3 space-y-2">
            <div className="h-6 bg-white/10 rounded" />
            <div className="h-3 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/10 rounded w-2/3" />
            <div className="h-3 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
          <div className="col-span-9 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 bg-white/10 rounded-lg" />
              <div className="h-16 bg-white/10 rounded-lg" />
              <div className="h-16 bg-white/10 rounded-lg" />
            </div>
            <div className="h-32 bg-white/10 rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 bg-white/10 rounded-lg" />
              <div className="h-20 bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockPhone({ accent }: { accent: string }) {
  return (
    <div className="mx-auto w-[200px] rounded-[2rem] border border-white/10 bg-neutral-950 p-2 shadow-2xl shadow-black/50">
      <div className={`aspect-[9/19] rounded-[1.5rem] bg-gradient-to-br ${accent} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-neutral-950/75" />
        <div className="absolute inset-0 p-4 space-y-3">
          <div className="h-6 bg-white/10 rounded" />
          <div className="h-24 bg-white/10 rounded-lg" />
          <div className="space-y-2">
            <div className="h-10 bg-white/10 rounded-lg" />
            <div className="h-10 bg-white/10 rounded-lg" />
            <div className="h-10 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

const SOLID_MAP: Record<string, { bg: string; text: string }> = {
  "from-red-500 to-orange-500":      { bg: "bg-red-500",     text: "text-red-500" },
  "from-indigo-500 to-purple-600":   { bg: "bg-indigo-500",  text: "text-indigo-500" },
  "from-emerald-500 to-teal-500":    { bg: "bg-emerald-500", text: "text-emerald-500" },
};

export default function InstantAppLandingTemplate({ app }: { app: InstantApp }) {
  const Icon = app.icon;
  const { bg: bgSolid, text: textSolid } = SOLID_MAP[app.accent] ?? { bg: "bg-neutral-900", text: "text-neutral-900" };

  return (
    <div className="min-h-screen bg-neutral-950 text-white antialiased">


      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-neutral-950/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-white">
            <ArrowRight size={14} className="rotate-180" />
            Back to Free Apps Daily
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-neutral-500">{app.hero.eyebrow}</span>
            <a href="#cta" className="bg-white text-neutral-950 text-xs font-bold px-4 py-2 rounded-xl hover:bg-neutral-200 transition-colors">
              Get Licensing Details
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${app.accent} opacity-[0.18]`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-8">
            <Icon size={12} className="text-white" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-300">{app.hero.eyebrow}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02] max-w-4xl mx-auto capitalize">
            {app.headline}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {app.subheadline}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#cta" className="bg-white text-neutral-950 font-bold px-6 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-neutral-200 transition-colors">
              Get Licensing Details <ArrowRight size={16} />
            </a>
            <a href="#demo" className="bg-white/5 border border-white/10 text-white font-semibold px-6 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-white/10 transition-colors">
              <Play size={14} /> Watch Demo
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-neutral-400">
            {app.hero.bullets.map(b => (
              <div key={b} className="flex items-center gap-1.5">
                <Check size={13} className="text-emerald-400" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="bg-white text-neutral-900 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-widest text-neutral-500 mb-3">See It Live</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight capitalize whitespace-nowrap text-neutral-950">A full platform, ready to brand.</h2>
            <p className="mt-4 text-neutral-600 max-w-2xl">Dashboards, mobile, onboarding, and client portals — designed to ship under your name from day one.</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              <MockBrowser accent={app.accent} />
              <p className="mt-3 text-xs text-neutral-500 text-center">Admin dashboard · your branding, your domain</p>
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <MockPhone accent={app.accent} />
              <p className="text-xs text-neutral-500 text-center -mt-3">Native mobile experience</p>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 h-full">
                <div className="text-xs font-bold tracking-widest text-neutral-500 mb-2">Onboarding Flow</div>
                <div className="space-y-2 mt-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold">{i}</div>
                      <div className="h-2 bg-neutral-200 rounded flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 h-full">
                <div className="text-xs font-bold tracking-widest text-neutral-500 mb-4">Branding Customization</div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-200" />
                  <div className="h-2 flex-1 bg-neutral-200 rounded" />
                </div>
                <div className="flex gap-2 mt-4">
                  {["bg-red-500","bg-indigo-500","bg-emerald-500","bg-amber-500","bg-fuchsia-500"].map(c => (
                    <div key={c} className={`w-6 h-6 rounded-full ${c}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 h-full">
                <div className="text-xs font-bold tracking-widest text-neutral-500 mb-4">Client-Facing Portal</div>
                <div className="space-y-2">
                  <div className="h-3 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  <div className="h-16 bg-white rounded-lg mt-3 border border-neutral-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* OPPORTUNITY */}
      <section className="border-t border-white/5 py-24 bg-gradient-to-b from-neutral-950 to-neutral-900">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs font-bold tracking-widest text-neutral-500 mb-4">The Opportunity</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight capitalize">{app.opportunity.title}</h2>
          <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">{app.opportunity.body}</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-3">
            {app.opportunity.points.map(p => (
              <div key={p} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-neutral-200">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-neutral-50 text-neutral-900 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-bold tracking-widest text-neutral-500 mb-3">What's Included</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight capitalize text-neutral-950">
              Everything to launch <br />
              a real software business.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INCLUDED.map(f => {
              const I = f.icon;
              return (
                <div key={f.title} className="group rounded-2xl border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-lg p-6 transition-all">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${app.accent} flex items-center justify-center mb-5 shadow-md`}>
                    <I size={18} className="text-white" />
                  </div>
                  <h3 className="font-bold text-neutral-950 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* WHO THIS IS FOR */}
      <section className="border-t border-white/5 py-24 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-neutral-500 mb-3">Who This Is For</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight capitalize">Built for operators who want to own, not rent.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {app.audience.map(a => {
              const I = AUDIENCE_ICONS[a] || Users;
              return (
                <div key={a} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center hover:border-white/30 transition-colors">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.accent} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <I size={18} className="text-white" />
                  </div>
                  <div className="text-sm font-semibold text-neutral-200">{a}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BUSINESS MODELS */}
      <section className="bg-white text-neutral-900 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-widest text-neutral-500 mb-3">Business Model</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight capitalize whitespace-nowrap text-neutral-950">How people use this platform.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {app.businessModels.map((m, i) => (
              <div key={m.title} className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-6 hover:border-neutral-400 hover:shadow-md transition-all overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${app.accent}`} />
                <div className={`text-xs font-mono font-bold mb-3 bg-gradient-to-r ${app.accent} bg-clip-text text-transparent`}>0{i + 1}</div>
                <h3 className="font-bold text-neutral-950 mb-2">{m.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CUSTOMIZATION */}
      <section className="border-t border-white/5 py-24 bg-gradient-to-b from-neutral-900 to-neutral-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-widest text-neutral-500 mb-3">Customization</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight capitalize">Every pixel is yours to brand.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {CUSTOMIZATION.map(c => {
              const I = c.icon;
              return (
                <div key={c.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center hover:border-white/30 transition-colors">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.accent} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <I size={16} className="text-white" />
                  </div>
                  <div className="text-sm font-semibold text-neutral-200">{c.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-neutral-50 text-neutral-900 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-widest text-neutral-500 mb-3">Social Proof</p>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight capitalize whitespace-nowrap text-neutral-950">Real operators. Real launches.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {app.metrics.map(m => (
              <div key={m.label} className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
                <div className={`text-4xl font-black tracking-tight bg-gradient-to-r ${app.accent} bg-clip-text text-transparent`}>{m.value}</div>
                <div className="text-xs text-neutral-500 tracking-widest mt-2">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {app.testimonials.map(t => (
              <div key={t.name} className="rounded-2xl border border-neutral-200 bg-white p-8">
                <div className="flex gap-1 mb-4">
                  {[0,1,2,3,4].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-lg text-neutral-800 leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">{t.name.split(" ").map(n=>n[0]).join("")}</div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-950">{t.name}</div>
                    <div className="text-xs text-neutral-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section className="border-t border-white/5 py-24 bg-neutral-900/50">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-neutral-500 mb-3">FAQ</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight capitalize">Common questions.</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {app.faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                <AccordionTrigger className="text-left text-white hover:no-underline font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-neutral-400 leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="cta" className="border-t border-white/5 py-32 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${app.accent} opacity-20`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08),_transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight whitespace-nowrap capitalize">Launch faster with AI</h2>
          <p className="mt-6 text-lg text-neutral-300">{app.price} · {app.ownership}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#" className="bg-white text-neutral-950 font-bold px-7 py-4 rounded-xl inline-flex items-center gap-2 hover:bg-neutral-200 transition-colors">
              Get Licensing Details <ArrowRight size={16} />
            </a>
            <a href="#demo" className="bg-white/10 border border-white/20 text-white font-semibold px-7 py-4 rounded-xl inline-flex items-center gap-2 hover:bg-white/15 transition-colors">
              <Play size={14} /> Watch Demo
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {app.badges.map(b => (
              <span key={b} className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${BADGE_DARK[b]}`}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
          <div>© {new Date().getFullYear()} {app.name} — Licensing & Ownership Program</div>
          <Link to="/" className="hover:text-white">← Back to Free Apps Daily</Link>
        </div>
      </footer>
    </div>
  );
}
