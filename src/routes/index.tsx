import { createFileRoute } from "@tanstack/react-router";
import FreeAppsDaily from "@/components/FreeAppsDaily";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Free Apps Daily — New AI App Drops Every Morning" },
      { name: "description", content: "Claim free access to premium AI apps every day. Curated drops, resets at midnight." },
      { property: "og:title", content: "Free Apps Daily" },
      { property: "og:description", content: "New free AI app drops every morning. Claim before midnight." },
    ],
  }),
  component: FreeAppsDaily,
});
