import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/apps.functions";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin Login — FreeAppsDaily" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const checkAdmin = useServerFn(checkIsAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      }
      // Verify admin role
      const { isAdmin } = await checkAdmin();
      if (!isAdmin) {
        await supabase.auth.signOut();
        setErr("Account created but no admin role. Ask the site owner to grant it.");
        setLoading(false);
        return;
      }
      navigate({ to: "/admin" });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center">
            <Lock size={18} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">FreeAppsDaily Admin</h1>
            <p className="text-xs text-neutral-500">Restricted access</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="admin@yourdomain.com"
            className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-red-500"
          />
          <div className="relative">
            <input
              type={showPw ? "text" : "password"} required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-neutral-200 rounded-lg px-3 py-2.5 pr-10 text-sm outline-none focus:border-red-500"
            />
            <button type="button" onClick={() => setShowPw(s => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {err && <div className="text-sm text-red-600">{err}</div>}
          <button type="submit" disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg transition-colors">
            {loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
          <button type="button" onClick={() => { setMode(m => m === "signin" ? "signup" : "signin"); setErr(""); }}
            className="w-full text-xs text-neutral-500 hover:text-neutral-900">
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
