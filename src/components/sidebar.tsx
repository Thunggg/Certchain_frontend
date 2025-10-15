"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Award,
  Palette,
  ShieldCheck,
  Wallet,
  SettingsIcon,
  Store,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
    {
      id: "mint-certificate",
      label: "Mint Certificate",
      icon: Award,
      href: "/mint/certificate",
    },
    {
      id: "mint-creative",
      label: "Mint Creative",
      icon: Palette,
      href: "/mint/creative",
    },
    { id: "verify", label: "Verify", icon: ShieldCheck, href: "/verify" },
    {
      id: "marketplace",
      label: "Marketplace",
      icon: Store,
      href: "/marketplace",
    },
    { id: "my-assets", label: "My Assets", icon: Wallet, href: "/my-assets" },
    { id: "issuer", label: "Issuer", icon: Building2, href: "/issuer" },
    {
      id: "settings",
      label: "Settings",
      icon: SettingsIcon,
      href: "/settings",
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-sidebar border-r border-sidebar-border justify-center">
        {/* Navigation */}
        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg",
                  isActive
                    ? "bg-primary text-primary-foreground glow-border-subtle"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
    </aside>
  );
};
