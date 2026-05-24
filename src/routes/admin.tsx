import { createFileRoute } from "@tanstack/react-router";
import AdminPanel from "@/components/AdminPanel";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — FreeAppsDaily" }] }),
  component: AdminPanel,
});
