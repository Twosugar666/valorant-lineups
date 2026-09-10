"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Role = "user" | "assistant";

type Msg = {
  id: string;
  role: Role;
  content: string;
};

const MAX_TURNS = 12; // user+assistant pairs kept roughly

const SUGGESTIONS = [
  "亚海悬城索瓦 A 点进攻怎么打侦察箭？",
  "裂变峡谷蝰蛇有哪些保包线？",
  "本站有哪些适合新手的烟雾点位？",
  "天堂地图赛菲尔特防守怎么摆？",
];

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;

      setError(null);
      setInput("");

      const userMsg: Msg = { id: uid(), role: "user", content };
      const assistantId = uid();
      const nextMessages = [...messages, userMsg].slice(-(MAX_TURNS * 2));

      setMessages([...nextMessages, { id: assistantId, role: "assistant", content: "" }]);
      setLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          let errText = `请求失败（${res.status}）`;
          try {
            const data = (await res.json()) as { error?: string };
            if (data.error) errText = data.error;
          } catch {
            /* ignore */
          }
          throw new Error(errText);
        }

        if (!res.body) {
          throw new Error("服务器未返回流式内容。");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const snapshot = acc;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: snapshot } : m
            )
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "发送失败，请重试。";
        setError(msg);
        setMessages((prev) =>
          prev.filter((m) => !(m.id === assistantId && !m.content))
        );
      } finally {
        setLoading(false);
      }
    },
    [loading, messages]
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setLoading(false);
  }

  return (
    <div className="flex min-h-[70vh] flex-col overflow-hidden rounded-lg border border-val-border bg-val-card">
      <div className="flex items-center justify-between border-b border-val-border px-4 py-3">
        <div>
          <h2 className="font-semibold text-foreground">点位问答 AI</h2>
          <p className="text-xs text-val-muted">
            由 DeepSeek 驱动 · 结合本站地图 / 特工 / 点位目录
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            className="rounded border border-val-border px-2.5 py-1 text-xs text-val-muted transition hover:border-val-red hover:text-foreground"
          >
            清空对话
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="space-y-4 py-6 text-center">
            <p className="text-sm text-val-muted">
              问问地图道具线、特工用法，或让我帮你找到站内点位。
            </p>
            <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={loading}
                  onClick={() => void send(s)}
                  className="rounded-full border border-val-border bg-val-elevated px-3 py-1.5 text-left text-xs text-val-muted transition hover:border-val-cyan hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-val-red/90 text-white"
                  : "border border-val-border bg-val-elevated text-foreground"
              }`}
            >
              {m.content || (loading ? "…" : "")}
            </div>
          </div>
        ))}

        {error && (
          <div className="rounded border border-val-red/50 bg-val-red/10 px-3 py-2 text-sm text-val-red">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="flex gap-2 border-t border-val-border bg-val-bg/40 p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例如：分裂地图零 A 天堂怎么架？"
          disabled={loading}
          className="min-w-0 flex-1 rounded border border-val-border bg-val-elevated px-3 py-2.5 text-sm outline-none placeholder:text-val-muted focus:border-val-cyan"
          maxLength={2000}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="shrink-0 rounded bg-val-red px-4 py-2.5 text-sm font-medium text-white transition hover:bg-val-red-dim disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "生成中…" : "发送"}
        </button>
      </form>
    </div>
  );
}
