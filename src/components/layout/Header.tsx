"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Library,
  Calendar,
  GitGraph,
  Heart,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "首页", icon: LayoutDashboard },
  { href: "/library", label: "卡片库", icon: Library },
  { href: "/daily", label: "每日推送", icon: Calendar },
  { href: "/mindmap", label: "思维导图", icon: GitGraph },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
          <span className="font-bold text-lg">MedReview</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({
                    variant: isActive ? "secondary" : "ghost",
                    size: "sm",
                  }),
                  "gap-1.5"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />
      </div>
    </header>
  );
}
