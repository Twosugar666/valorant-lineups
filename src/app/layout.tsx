import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "瓦罗兰特点位指南",
    template: "%s · 瓦罗兰特点位指南",
  },
  description:
    "瓦罗兰特（Valorant）地图道具点位图文指南：按地图 / 特工浏览进攻与防守技能线，含站位、准星、落点步骤说明。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="relative mx-auto min-h-[70vh] max-w-6xl px-4 py-8 md:py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
