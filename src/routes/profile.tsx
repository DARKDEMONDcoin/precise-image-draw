import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CarFront, LogOut, Settings as SettingsIcon, Star, Wallet as WalletIcon } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/limo/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { t } from "@/lib/limo/i18n";
import { formatEGP } from "@/lib/limo/pricing";
import { useStore } from "@/lib/limo/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "الحساب — ليمو" },
      { name: "description", content: "بياناتك الشخصية ورقم الموبايل ورصيد المحفظة ورحلاتك." },
      { property: "og:title", content: "الحساب — ليمو" },
      { property: "og:description", content: "إدارة بياناتك الشخصية في تطبيق ليمو." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { lang, user, setUser, wallet } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  if (!user) {
    return (
      <AppShell>
        <PageHeader title={t("profile", lang)} />
        <div className="px-4">
          <Button asChild className="w-full" size="lg">
            <Link to="/auth">{t("sendCode", lang)}</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title={t("profile", lang)} />
      <div className="space-y-4 px-4">
        <div className="card-surface flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-bold">{t("riderScore", lang)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("scoreOutOf", lang)}</p>
          </div>
          <div className="flex items-center gap-2 text-gold-foreground">
            <Star className="size-5 fill-gold text-gold" />
            <span dir="ltr" className="text-2xl font-extrabold tabular-nums">
              {user.riderScore.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="card-surface space-y-4 p-4">
          <div className="space-y-1.5">
            <Label htmlFor="pname">{t("name", lang)}</Label>
            <Input
              id="pname"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 60))}
              className="h-12"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pemail">{t("email", lang)}</Label>
            <Input
              id="pemail"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value.slice(0, 120))}
              className="h-12"
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("phone", lang)}</Label>
            <p dir="ltr" className="rounded-lg bg-secondary px-3 py-3 text-sm font-semibold">
              {user.phone}
            </p>
          </div>
          <Button
            className="w-full"
            onClick={() => {
              setUser({ ...user, name: name.trim() || user.name, email: email.trim() });
              toast.success(t("saved", lang));
            }}
          >
            {t("editDetails", lang)}
          </Button>
        </div>

        <div className="card-surface divide-y divide-border">
          <Link to="/wallet" className="flex items-center justify-between p-4 text-sm font-medium">
            <span className="flex items-center gap-2">
              <WalletIcon className="size-4 text-primary" /> {t("wallet", lang)}
            </span>
            <span className="text-muted-foreground">{formatEGP(wallet, lang)}</span>
          </Link>
          <Link to="/trips" className="flex items-center gap-2 p-4 text-sm font-medium">
            <CarFront className="size-4 text-primary" /> {t("myTrips", lang)}
          </Link>
          <Link to="/settings" className="flex items-center gap-2 p-4 text-sm font-medium">
            <SettingsIcon className="size-4 text-primary" /> {t("settings", lang)}
          </Link>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full text-destructive">
              <LogOut className="size-4" /> {t("logout", lang)}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>{t("logoutConfirm", lang)}</AlertDialogTitle>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel", lang)}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setUser(null);
                  navigate({ to: "/" });
                }}
              >
                {t("confirm", lang)}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}
