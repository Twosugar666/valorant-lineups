"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "首页" },
  { href: "/maps", label: "地图" },
  { href: "/agents", label: "英雄" },
  { href: "/search", label: "搜索" },
] as const;

const askHref = "/ask";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname() || "/";

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-val-bg/80 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-val-red/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 font-bold tracking-wide"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
            <span className="absolute inset-0 rotate-45 rounded-[3px] bg-val-red/15 ring-1 ring-val-red/35 transition duration-300 group-hover:bg-val-red/30 group-hover:shadow-[0_0_24px_rgba(255,70,85,0.35)]" />
            <span className="absolute inset-[7px] rotate-45 rounded-[2px] bg-val-red/10" />
            <span className="relative h-2.5 w-2.5 rotate-45 bg-val-red shadow-[0_0_14px_#ff4655]" />
          </span>
          <span className="truncate text-[15px] sm:text-base">
            <span className="text-foreground/95">无畏契约</span>
            <span className="text-val-red drop-shadow-[0_0_10px_rgba(255,70,85,0.45)]">
              点位
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav
            className="flex items-center gap-0.5 rounded-full border border-white/5 bg-black/25 p-1 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            aria-label="主导航"
          >
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "relative rounded-full px-3 py-1.5 transition duration-200 sm:px-3.5",
                    active
                      ? "bg-val-red/15 text-foreground shadow-[0_0_0_1px_rgba(255,70,85,0.35)]"
                      : "text-val-muted hover:bg-white/5 hover:text-foreground",
                  ].join(" ")}
                >
                  {item.label}
                  {active ? (
                    <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px bg-val-red/80" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <Link
            href={askHref}
            aria-current={isActive(pathname, askHref) ? "page" : undefined}
            className={[
              "ml-1 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition duration-200 sm:ml-2",
              isActive(pathname, askHref)
                ? "bg-val-red text-white shadow-[0_0_20px_rgba(255,70,85,0.45)]"
                : "bg-val-red/90 text-white hover:bg-val-red hover:shadow-[0_0_18px_rgba(255,70,85,0.4)]",
            ].join(" ")}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
            问答 AI
          </Link>
        </div>
      </div>
    </header>
  );
}
