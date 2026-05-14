import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { createClient } from "@supabase/supabase-js";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are Deen AI, a knowledgeable, humble Islamic study companion inside the "Deen Buddy" app.

Guidance for every reply:
- Answer questions about Islam: Quran, Hadith, Seerah, fiqh, Aqeedah, du'as, history, ethics, daily practice.
- Cite sources when relevant (Quran chapter:verse, Sahih Bukhari/Muslim, etc.) and note when scholars differ.
- Use respectful Islamic etiquette: write ﷺ after the Prophet Muhammad, and (AS) after other prophets.
- For matters with scholarly disagreement (madhhabs), summarise the main views without forcing one.
- For complex personal/legal/medical issues, gently advise consulting a qualified local scholar.
- Be warm, concise, and clear. Use markdown headings, lists, and short Arabic snippets where helpful.
- Refuse to issue rulings on matters that require an actual mufti, hate content, or anything mocking faiths.`;

export const Route = createFileRoute("/api/deen-chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const auth = request.headers.get("authorization");
        if (!auth?.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = auth.slice(7);

        const supabaseUrl = process.env.SUPABASE_URL;
        const publishable = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!supabaseUrl || !publishable) {
          return new Response("Server misconfigured", { status: 500 });
        }

        const supabase = createClient(supabaseUrl, publishable, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr || !userData.user) {
          return new Response("Unauthorized", { status: 401 });
        }
        const userId = userData.user.id;

        const body = (await request.json()) as {
          messages?: UIMessage[];
          threadId?: string;
        };
        const messages = body.messages ?? [];
        const threadId = body.threadId;
        if (!threadId || !Array.isArray(messages) || messages.length === 0) {
          return new Response("Bad request", { status: 400 });
        }

        // Verify thread belongs to user
        const { data: thread, error: threadErr } = await supabase
          .from("chat_threads")
          .select("id,title")
          .eq("id", threadId)
          .maybeSingle();
        if (threadErr || !thread) {
          return new Response("Thread not found", { status: 404 });
        }

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(apiKey);
        const model = gateway("google/gemini-3-flash-preview");

        // Persist the latest user message immediately
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        if (lastUser) {
          await supabase.from("chat_messages").insert({
            thread_id: threadId,
            user_id: userId,
            role: "user",
            message: lastUser as unknown as Record<string, unknown>,
          });

          // Auto-title using first user text if still default
          if (thread.title === "New chat") {
            const text = lastUser.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join(" ")
              .trim()
              .slice(0, 60);
            if (text) {
              await supabase
                .from("chat_threads")
                .update({ title: text })
                .eq("id", threadId);
            }
          }
        }

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          onFinish: async ({ messages: finalMessages }) => {
            const assistant = [...finalMessages]
              .reverse()
              .find((m) => m.role === "assistant");
            if (assistant) {
              await supabase.from("chat_messages").insert({
                thread_id: threadId,
                user_id: userId,
                role: "assistant",
                message: assistant as unknown as Record<string, unknown>,
              });
            }
          },
        });
      },
    },
  },
});
