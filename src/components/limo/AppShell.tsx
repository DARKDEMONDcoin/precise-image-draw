import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Users, CornerUpLeft, Wallet, User } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/limo/store";
import { t, type Key } from "@/lib/limo/i18n";
import { cn } from "@/lib/utils";

const TABS: { to: string; icon: typeof Home; key: Key }[] = [
  { to: "/", icon: Home, key: "home" },
  { to: "/community", icon: Users, key: "community" },
  { to: "/returns", icon: CornerUpLeft, key: "returns" },
  { to: "/wallet", icon: Wallet, key: "wallet" },
  { to: "/profile", icon: User, key: "profile" },
];

export function BottomNav() {
  const { lang } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5">
        {TABS.map(({ to, icon: Icon, key }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("size-5", active && "stroke-[2.4]")} />
                <span className="truncate">{t(key, lang)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-3 px-5 pb-4 pt-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function AppShell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      <div className={cn("mx-auto w-full max-w-md", nav && "pb-24")}>{children}</div>
      {nav ? <BottomNav /> : null}
    </div>
  );
}
