import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Plus, Trash2, Edit2, Save, X, Eye, EyeOff,
  LogOut, RefreshCw, Users, Zap, Star, Crown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchAllApps, fetchAdminStats, saveApp, removeApp, setAppActive, checkIsAdmin,
  type AdminApp,
} from "@/lib/apps.functions";

const CATEGORIES = ["Video", "Content", "Real Estate", "Sales", "Productivity", "Health", "Finance"];
const BADGE_OPTIONS = ["FREE TODAY", "STAFF PICK", "WHITE LABEL", "RESELLABLE", "NEW", "OWNED"];

type AppForm = Omit<AdminApp, "id" | "claimed_today"> & { id?: string };

const EMPTY_APP: AppForm = {
  name: "",
  category: "Content",
  emoji: "🤖",
  offer: "",
  value_cents: 0,
  description: "",
  affiliate_url: "",
  badges: ["FREE TODAY"],
  active_date: new Date().toISOString().slice(0, 10),
  featured: false,
  our_pick: false,
  active: true,
  sort_order: 0,
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const loadApps = useServerFn(fetchAllApps);
  const loadStats = useServerFn(fetchAdminStats);
  const upsert = useServerFn(saveApp);
  const del = useServerFn(removeApp);
  const toggleActive = useServerFn(setAppActive);
  const checkAdmin = useServerFn(checkIsAdmin);

  const [ready, setReady] = useState(false);
  const [apps, setApps] = useState<AdminApp[]>([]);
  const [stats, setStats] = useState<{ subscriberCount: number; unlockCount: number; todayUnlockCount: number } | null>(null);
  const [editApp, setEditApp] = useState<AppForm | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [a, s] = await Promise.all([loadApps(), loadStats()]);
    setApps(a);
    setStats(s);
  }, [loadApps, loadStats]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/login" });
        return;
      }
      try {
        const { isAdmin } = await checkAdmin();
        if (!isAdmin) {
          await supabase.auth.signOut();
          navigate({ to: "/login" });
          return;
        }
        await load();
        setReady(true);
      } catch {
        navigate({ to: "/login" });
      }
    })();
  }, [navigate, checkAdmin, load]);

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  async function save() {
    if (!editApp) return;
    setSaving(true);
    try {
      await upsert({ data: editApp });
      setEditApp(null);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this app?")) return;
    await del({ data: { id } });
    await load();
  }

  async function handleToggle(app: AdminApp) {
    await toggleActive({ data: { id: app.id, active: !app.active } });
    await load();
  }

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-500">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-600" />
          <h1 className="text-lg font-black tracking-tight">FreeAppsDaily Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-600" title="Refresh">
            <RefreshCw size={16} />
          </button>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-100">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 px-6 py-4">
          <Stat icon={<Users size={16} />} label="Subscribers" value={stats.subscriberCount} />
          <Stat icon={<Zap size={16} />} label="Total Claims" value={stats.unlockCount} />
          <Stat icon={<Star size={16} />} label="Claimed Today" value={stats.todayUnlockCount} />
        </div>
      )}

      {/* Apps list */}
      <div className="px-6 pb-12">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">Apps</h2>
          <button
            onClick={() => setEditApp({ ...EMPTY_APP, sort_order: apps.length })}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-3 py-2 rounded-lg"
          >
            <Plus size={14} /> New App
          </button>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="text-left px-4 py-3">App</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Badges</th>
                <th className="text-left px-4 py-3">Today</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{app.emoji}</span>
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          {app.name}
                          {app.featured && <Crown size={12} className="text-amber-500" />}
                          {app.our_pick && <Star size={12} className="text-red-500" />}
                        </div>
                        <div className="text-xs text-neutral-500">{app.category} · {app.offer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-600">{app.active_date}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {app.badges.map(b => (
                        <span key={b} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 rounded">{b}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{app.claimed_today}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(app)}
                      className={`text-xs font-bold px-2 py-1 rounded ${app.active ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                      {app.active ? "Active" : "Off"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditApp(app)} className="p-1.5 hover:bg-neutral-100 rounded text-neutral-600" title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(app.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {apps.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-neutral-400">No apps yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editApp && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white">
              <h3 className="font-bold">{editApp.id ? "Edit App" : "New App"}</h3>
              <button onClick={() => setEditApp(null)} className="p-1 hover:bg-neutral-100 rounded">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Row label="Name">
                <input value={editApp.name} onChange={e => setEditApp({ ...editApp, name: e.target.value })} className={inputCls} />
              </Row>
              <div className="grid grid-cols-2 gap-3">
                <Row label="Category">
                  <select value={editApp.category} onChange={e => setEditApp({ ...editApp, category: e.target.value })} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Row>
                <Row label="Emoji">
                  <input value={editApp.emoji} onChange={e => setEditApp({ ...editApp, emoji: e.target.value })} className={inputCls} />
                </Row>
              </div>
              <Row label="Offer (e.g. 14-Day Pro Free)">
                <input value={editApp.offer} onChange={e => setEditApp({ ...editApp, offer: e.target.value })} className={inputCls} />
              </Row>
              <Row label="Description">
                <textarea value={editApp.description} onChange={e => setEditApp({ ...editApp, description: e.target.value })} className={`${inputCls} min-h-[80px]`} />
              </Row>
              <Row label="Affiliate URL">
                <input value={editApp.affiliate_url} onChange={e => setEditApp({ ...editApp, affiliate_url: e.target.value })} placeholder="https://…" className={inputCls} />
              </Row>
              <div className="grid grid-cols-3 gap-3">
                <Row label="Value ($)">
                  <input type="number" value={editApp.value_cents / 100}
                    onChange={e => setEditApp({ ...editApp, value_cents: Math.round(Number(e.target.value) * 100) })} className={inputCls} />
                </Row>
                <Row label="Active date">
                  <input type="date" value={editApp.active_date} onChange={e => setEditApp({ ...editApp, active_date: e.target.value })} className={inputCls} />
                </Row>
                <Row label="Sort order">
                  <input type="number" value={editApp.sort_order} onChange={e => setEditApp({ ...editApp, sort_order: Number(e.target.value) })} className={inputCls} />
                </Row>
              </div>
              <Row label="Badges">
                <div className="flex flex-wrap gap-2">
                  {BADGE_OPTIONS.map(b => {
                    const on = editApp.badges.includes(b);
                    return (
                      <button key={b} type="button"
                        onClick={() => setEditApp({
                          ...editApp,
                          badges: on ? editApp.badges.filter(x => x !== b) : [...editApp.badges, b],
                        })}
                        className={`text-xs px-2 py-1 rounded-full border ${on ? "bg-red-50 text-red-700 border-red-200" : "bg-white text-neutral-500 border-neutral-200"}`}>
                        {b}
                      </button>
                    );
                  })}
                </div>
              </Row>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <Toggle label="Featured (hero)" value={editApp.featured} onChange={v => setEditApp({ ...editApp, featured: v })} />
                <Toggle label="Our Pick" value={editApp.our_pick} onChange={v => setEditApp({ ...editApp, our_pick: v })} />
                <Toggle label="Active" value={editApp.active} onChange={v => setEditApp({ ...editApp, active: v })} />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button onClick={() => setEditApp(null)} className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm px-4 py-2 rounded-lg">
                <Save size={14} /> {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-neutral-500 mb-1 uppercase tracking-wider">{label}</div>
      {children}
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-semibold ${value ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-neutral-500 border-neutral-200"}`}>
      {label}
      {value ? <Eye size={14} /> : <EyeOff size={14} />}
    </button>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-xs text-neutral-500 uppercase tracking-wider">{label}</div>
        <div className="text-xl font-black">{value.toLocaleString()}</div>
      </div>
    </div>
  );
}
