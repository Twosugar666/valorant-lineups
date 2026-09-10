import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { SYSTEM_PROMPT, buildSiteCatalog } from "@/lib/ai-context";

export const runtime = "nodejs";

type InMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const MAX_MESSAGES = 20;
const MAX_CONTENT_LEN = 4000;

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "未配置 DEEPSEEK_API_KEY。请在项目根目录创建 .env.local 并填入密钥后重启开发服务器。",
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "请求体必须是 JSON。" }, { status: 400 });
  }

  const messagesRaw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messagesRaw) || messagesRaw.length === 0) {
    return Response.json(
      { error: "请提供 messages 数组（至少一条消息）。" },
      { status: 400 }
    );
  }

  const messages: ChatCompletionMessageParam[] = messagesRaw
    .filter((m): m is InMessage => {
      if (!m || typeof m !== "object") return false;
      const role = (m as InMessage).role;
      const content = (m as InMessage).content;
      return (
        (role === "user" || role === "assistant") &&
        typeof content === "string" &&
        content.trim().length > 0
      );
    })
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content.slice(0, MAX_CONTENT_LEN),
    }));

  if (messages.length === 0) {
    return Response.json({ error: "没有有效的对话消息。" }, { status: 400 });
  }

  const model = process.env.DEEPSEEK_MODEL || "deepseek-flash";
  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.deepseek.com",
  });
  const systemContent = SYSTEM_PROMPT + buildSiteCatalog();

  try {
    const stream = await client.chat.completions.create({
      model,
      stream: true,
      messages: [
        { role: "system", content: systemContent },
        ...messages,
      ],
      // DeepSeek extension: disable thinking for faster Q&A
      ...({ thinking: { type: "disabled" } } as Record<string, unknown>),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              controller.enqueue(encoder.encode(delta));
            }
          }
          controller.close();
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : "流式响应中断，请稍后重试。";
          controller.enqueue(encoder.encode(`\n\n[错误] ${msg}`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : "调用 DeepSeek 失败，请稍后重试。";
    return Response.json({ error: `AI 服务错误：${msg}` }, { status: 502 });
  }
}
