import { createFileRoute, notFound } from "@tanstack/react-router";
import InstantAppLandingTemplate from "@/components/InstantAppLandingTemplate";
import { getInstantApp, INSTANT_APPS } from "@/data/instant-apps";

export const Route = createFileRoute("/instant-apps/$slug")({
  loader: ({ params }) => {
    const app = getInstantApp(params.slug);
    if (!app) throw notFound();
    return { app };
  },
  head: ({ loaderData }) => {
    const app = loaderData?.app;
    if (!app) return { meta: [{ title: "Instant App" }] };
    const title = `${app.headline} — ${app.name}`;
    const desc = app.subheadline;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-black mb-3">Instant App not found</h1>
        <p className="text-neutral-400 mb-6">Available: {INSTANT_APPS.map(a => a.slug).join(", ")}</p>
        <a href="/" className="text-white underline">Back to Free Apps Daily</a>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-neutral-400 text-sm">{error.message}</p>
      </div>
    </div>
  ),
  component: InstantAppPage,
});

function InstantAppPage() {
  const { app } = Route.useLoaderData();
  return <InstantAppLandingTemplate app={app} />;
}
