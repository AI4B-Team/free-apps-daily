import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface PublicApp {
  id: string;
  name: string;
  category: string;
  emoji: string;
  offer: string;
  value_cents: number;
  description: string;
  badges: string[];
  featured: boolean;
  our_pick: boolean;
  sort_order: number;
  claimed_today: number;
}

export interface AdminApp extends PublicApp {
  affiliate_url: string;
  active: boolean;
  active_date: string;
}

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Public: today's active apps + live claim counts (safe columns only). */
export const fetchTodaysApps = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicApp[]> => {
    const today = todayISO();
    const { data: apps, error } = await supabaseAdmin
      .from("apps")
      .select(
        "id, name, category, emoji, offer, value_cents, description, badges, featured, our_pick, sort_order",
      )
      .eq("active", true)
      .eq("active_date", today)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);

    const ids = (apps ?? []).map(a => a.id);
    let counts: Record<string, number> = {};
    if (ids.length > 0) {
      const { data: unlocks } = await supabaseAdmin
        .from("unlocks")
        .select("app_id")
        .in("app_id", ids)
        .gte("claimed_at", `${today}T00:00:00Z`);
      counts = (unlocks ?? []).reduce<Record<string, number>>((acc, u) => {
        acc[u.app_id] = (acc[u.app_id] ?? 0) + 1;
        return acc;
      }, {});
    }

    return (apps ?? []).map(a => ({
      ...a,
      claimed_today: counts[a.id] ?? 0,
    }));
  },
);

/** Public: subscribe an email. */
export const subscribe = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      email: z.string().email().max(320),
      industry: z.string().max(64).default("All"),
      source: z.string().max(32).default("hero"),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("subscribers")
      .upsert(
        { email: data.email.toLowerCase(), industry: data.industry, source: data.source },
        { onConflict: "email", ignoreDuplicates: true },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Public: record an app claim and return the affiliate URL. */
export const claimApp = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      email: z.string().email().max(320),
      app_id: z.string().uuid(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const email = data.email.toLowerCase();

    const { data: app, error: appErr } = await supabaseAdmin
      .from("apps")
      .select("affiliate_url, active")
      .eq("id", data.app_id)
      .maybeSingle();
    if (appErr) throw new Error(appErr.message);
    if (!app || !app.active) throw new Error("App not available");

    await supabaseAdmin
      .from("subscribers")
      .upsert(
        { email, industry: "All", source: "claim" },
        { onConflict: "email", ignoreDuplicates: true },
      );

    await supabaseAdmin
      .from("unlocks")
      .upsert(
        { email, app_id: data.app_id, affiliate_url: app.affiliate_url },
        { onConflict: "email,app_id", ignoreDuplicates: true },
      );

    return { ok: true, affiliate_url: app.affiliate_url };
  });

// ── Admin ─────────────────────────────────────────────────────────────

export const fetchAllApps = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminApp[]> => {
    await assertAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("apps")
      .select("*")
      .order("active_date", { ascending: false })
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);

    const today = todayISO();
    const { data: unlocks } = await supabaseAdmin
      .from("unlocks")
      .select("app_id")
      .gte("claimed_at", `${today}T00:00:00Z`);
    const counts = (unlocks ?? []).reduce<Record<string, number>>((acc, u) => {
      acc[u.app_id] = (acc[u.app_id] ?? 0) + 1;
      return acc;
    }, {});
    return (data ?? []).map(a => ({ ...a, claimed_today: counts[a.id] ?? 0 }));
  });

const AppInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  category: z.string().min(1).max(64),
  emoji: z.string().min(1).max(8),
  offer: z.string().min(1).max(120),
  value_cents: z.number().int().min(0).max(1_000_000),
  description: z.string().min(1).max(1000),
  affiliate_url: z.string().url().max(2000).or(z.literal("")),
  badges: z.array(z.string().min(1).max(32)).max(8),
  active_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  featured: z.boolean(),
  our_pick: z.boolean(),
  active: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export const saveApp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => AppInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.id) {
      const { error } = await supabaseAdmin.from("apps").update(data).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { id: _omit, ...insert } = data;
    const { data: row, error } = await supabaseAdmin
      .from("apps").insert(insert).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const removeApp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("apps").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setAppActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), active: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("apps").update({ active: data.active }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const fetchAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const today = todayISO();
    const [subs, unlocks, todayUnlocks] = await Promise.all([
      supabaseAdmin.from("subscribers").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("unlocks").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("unlocks").select("*", { count: "exact", head: true }).gte("claimed_at", `${today}T00:00:00Z`),
    ]);
    return {
      subscriberCount: subs.count ?? 0,
      unlockCount: unlocks.count ?? 0,
      todayUnlockCount: todayUnlocks.count ?? 0,
    };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });
