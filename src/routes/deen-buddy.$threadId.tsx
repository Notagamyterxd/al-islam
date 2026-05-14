import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getThreadMessages } from "@/lib/deen-chat.functions";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import logo from "@/assets/deen-buddy-logo.png";

export const Route = createFileRoute("/deen-buddy/$threadId")({
  component: ChatPage,
});

const SUGGESTIONS = [
  "What is the meaning of Surah Al-Fatiha?",
  "How do I perform Wudu correctly?",
  "Explain the five pillars of Islam.",
  "What does the Quran say about kindness to parents?",
];

function ChatPage() {
  const { threadId } = Route.useParams();
  const fetchMessages = useServerFn(getThreadMessages);

  const { data: initial, isLoading } = useQuery({
    queryKey: ["deen-thread-messages", threadId],
    queryFn: () => fetchMessages({ data: { threadId } }),
  });

  if (isLoading || !initial) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Loading conversation…
      </div>
    );
  }

  return <ChatInner threadId={threadId} initialMessages={initial.messages as UIMessage[]} />;
}

function ChatInner({ threadId, initialMessages }: { threadId: string; initialMessages: UIMessage[] }) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/deen-chat",
        prepareSendMessagesRequest: async ({ messages, body }) => {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          return {
            body: { messages, threadId, ...(body ?? {}) },
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          };
        },
      }),
    [threadId],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
  });

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status]);

  const submit = async (text: string) => {
    const t = text.trim();
    if (!t) return;
    setInput("");
    await sendMessage({ text: t });
  };

  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[480px] flex-col rounded-2xl border border-border/60 bg-card/30">
      <Conversation className="flex-1">
        <ConversationContent className="px-3 sm:px-6">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<img src={logo} alt="Deen Buddy" width={64} height={64} />}
              title="As-salāmu ʿalaykum"
              description="Ask Deen AI anything about Islam — Quran, Hadith, fiqh, du'as, or daily practice."
            >
              <div className="mt-4 grid w-full max-w-md grid-cols-1 gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-xl border border-border bg-background/40 px-3 py-2 text-left text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role === "user" ? "user" : "assistant"}>
                <MessageContent variant={m.role === "user" ? "contained" : "flat"}>
                  {m.parts.map((part, i) => {
                    if (part.type === "text") {
                      return m.role === "assistant" ? (
                        <MessageResponse key={i}>{part.text}</MessageResponse>
                      ) : (
                        <span key={i} className="whitespace-pre-wrap">{part.text}</span>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent variant="flat">
                <Shimmer>Deen AI is thinking…</Shimmer>
              </MessageContent>
            </Message>
          )}

          {error && (
            <p className="mt-2 px-2 text-xs text-destructive">
              Something went wrong. Please try again.
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border/60 p-3 sm:p-4">
        <PromptInput
          onSubmit={(_msg, e) => {
            e.preventDefault();
            void submit(input);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Deen AI about Islam…"
            disabled={isBusy}
          />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} disabled={isBusy || input.trim().length === 0} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
