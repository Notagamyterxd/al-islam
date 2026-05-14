import { createFileRoute, Link, Outlet, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, MessageSquare, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  listThreads,
  createThread,
  deleteThread,
} from "@/lib/deen-chat.functions";
import logo from "@/assets/deen-buddy-logo.png";

export const Route = createFileRoute("/deen-buddy")({
  head: () => ({
    meta: [
      { title: "Deen Buddy — Ask Deen AI about Islam" },
      { name: "description", content: "Chat with Deen AI: ask any question about Islam, Quran, hadith, fiqh, and daily practice. Private threaded conversations." },
    ],
  }),
  component: DeenBuddyLayout,
});

function DeenBuddyLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();
  const fetchList = useServerFn(listThreads);
  const fetchCreate = useServerFn(createThread);
  const fetchDelete = useServerFn(deleteThread);
  const [creating, setCreating] = useState(false);

  const { data: threads = [] } = useQuery({
    queryKey: ["deen-threads", user?.id],
    queryFn: () => fetchList(),
    enabled: !!user,
  });

  const activeId = (router.state.location.pathname.match(/^\/deen-buddy\/([^/]+)/) ?? [])[1];

  const newThread = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const t = await fetchCreate({ data: {} });
      await qc.invalidateQueries({ queryKey: ["deen-threads", user?.id] });
      navigate({ to: "/deen-buddy/$threadId", params: { threadId: t.id } });
    } finally {
      setCreating(false);
    }
  };

  const removeThread = async (id: string) => {
    await fetchDelete({ data: { id } });
    await qc.invalidateQueries({ queryKey: ["deen-threads", user?.id] });
    if (activeId === id) navigate({ to: "/deen-buddy" });
  };

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-16 text-sm text-muted-foreground">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <img src={logo} alt="Deen Buddy" width={80} height={80} className="mx-auto" />
        <h1 className="mt-4 font-display text-3xl text-foreground">Deen Buddy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to chat with Deen AI and keep your conversations.
        </p>
        <Link
          to="/auth"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-glow"
        >
          <LogIn className="h-4 w-4" /> Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-4 px-3 py-4 sm:px-6 sm:py-6">
      <aside className="hidden w-64 flex-none flex-col gap-2 sm:flex">
        <button
          onClick={newThread}
          disabled={creating}
          className="flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition hover:scale-[1.02] disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> New chat
        </button>
        <div className="mt-2 flex-1 space-y-1 overflow-y-auto">
          {threads.length === 0 && (
            <p className="px-2 py-3 text-xs text-muted-foreground">No conversations yet.</p>
          )}
          {threads.map((t) => (
            <div
              key={t.id}
              className={`group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${
                activeId === t.id ? "bg-card text-foreground" : "text-muted-foreground hover:bg-card/60"
              }`}
            >
              <button
                onClick={() => navigate({ to: "/deen-buddy/$threadId", params: { threadId: t.id } })}
                className="flex flex-1 items-center gap-2 truncate text-left"
              >
                <MessageSquare className="h-3.5 w-3.5 flex-none" />
                <span className="truncate">{t.title}</span>
              </button>
              <button
                onClick={() => removeThread(t.id)}
                className="flex-none rounded p-1 text-muted-foreground opacity-0 transition hover:text-destructive group-hover:opacity-100"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        {/* Mobile new-chat */}
        <div className="mb-3 flex items-center justify-between sm:hidden">
          <select
            value={activeId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (v) navigate({ to: "/deen-buddy/$threadId", params: { threadId: v } });
              else navigate({ to: "/deen-buddy" });
            }}
            className="flex-1 rounded-full border border-border bg-card px-3 py-2 text-xs text-foreground"
          >
            <option value="">Select chat…</option>
            {threads.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <button
            onClick={newThread}
            disabled={creating}
            className="ml-2 flex flex-none items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>

        <Outlet />
      </section>
    </div>
  );
}

// Auto-create logic for the index of /deen-buddy
export function DeenBuddyEmpty() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fetchList = useServerFn(listThreads);
  const fetchCreate = useServerFn(createThread);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const list = await fetchList();
      if (cancelled) return;
      if (list.length > 0) {
        navigate({ to: "/deen-buddy/$threadId", params: { threadId: list[0].id }, replace: true });
      } else {
        const t = await fetchCreate({ data: {} });
        if (!cancelled) navigate({ to: "/deen-buddy/$threadId", params: { threadId: t.id }, replace: true });
      }
    })();
    return () => { cancelled = true; };
  }, [user, fetchList, fetchCreate, navigate]);

  return (
    <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
      Opening Deen Buddy…
    </div>
  );
}
