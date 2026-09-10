import type { Metadata } from "next";
import Link from "next/link";
import { ChatPanel } from "@/components/ChatPanel";

export const metadata: Metadata = {
  title: "问答 AI",
  description:
    "无畏契约道具点位中文 AI 助手：结合本站地图、英雄与点位目录，解答进攻/防守 utility lineup 问题。",
};

export default function AskPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">
          问答 <span className="text-val-red">AI</span>
        </h1>
        <p className="mt-1 text-sm text-val-muted">
          中文点位教练 · 不确定时会说明，并引导你去站内{" "}
          <Link href="/maps" className="text-val-cyan hover:underline">
            地图
          </Link>
          、
          <Link href="/agents" className="text-val-cyan hover:underline">
            英雄
          </Link>
          、
          <Link href="/search" className="text-val-cyan hover:underline">
            搜索
          </Link>{" "}
          查看图文步骤。
        </p>
      </div>
      <ChatPanel />
    </div>
  );
}
