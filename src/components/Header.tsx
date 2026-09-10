import Link from "next/link";

const nav = [
  { href: "/", label: "首页" },
  { href: "/maps", label: "地图" },
  { href: "/agents", label: "特工" },
  { href: "/search", label: "搜索" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-val-border bg-val-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-wide">
          <span className="inline-block h-3 w-3 bg-val-red" />
          <span>
            瓦罗兰特<span className="text-val-red">点位</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-1.5 text-val-muted transition hover:bg-val-elevated hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
