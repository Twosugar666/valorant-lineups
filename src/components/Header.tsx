import Link from "next/link";

const nav = [
  { href: "/", label: "首页" },
  { href: "/maps", label: "地图" },
  { href: "/agents", label: "英雄" },
  { href: "/search", label: "搜索" },
  { href: "/ask", label: "问答 AI" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-val-border/80 bg-val-bg/75 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-val-red/50 to-transparent" />
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2.5 font-bold tracking-wide">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rotate-45 bg-val-red/20 transition group-hover:bg-val-red/35" />
            <span className="relative h-2.5 w-2.5 bg-val-red shadow-[0_0_10px_#ff4655]" />
          </span>
          <span className="text-[15px]">
            无畏契约<span className="text-val-red">点位</span>
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-1.5 text-val-muted transition hover:bg-val-elevated/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
