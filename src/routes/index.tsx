import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpDown, Users, CornerUpLeft, Wallet as WalletIcon, Car } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/limo/AppShell";
import { SaveTag } from "@/components/limo/bits";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CITIES, cityName, type CityId } from "@/lib/limo/data";
import { t } from "@/lib/limo/i18n";
import { formatEGP } from "@/lib/limo/pricing";
import { useStore } from "@/lib/limo/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ليمو — احجز رحلتك بين المدن" },
      {
        name: "description",
        content:
          "احجز ليموزين خاص بين طنطا والقاهرة والإسكندرية والمنصورة وكفر الشيخ، أو شارك الرحلة ووفّر حتى 60%.",
      },
      { property: "og:title", content: "ليمو — احجز رحلتك بين المدن" },
      {
        property: "og:description",
        content: "حجز ليموزين خاص، رحلات مشاركة، ورحلات عودة بخصم كبير.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { lang, user, draft, setDraft, wallet } = useStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const maxRiders = draft.airport ? 2 : 3;
  const todayStr = new Date().toISOString().slice(0, 10);

  if (!user) {
    return (
      <AppShell nav={false}>
        <div className="flex min-h-screen flex-col justify-center gap-8 px-6">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Car className="size-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground">{t("appName", lang)}</h1>
            <p className="text-muted-foreground">{t("tagline", lang)}</p>
          </div>
          <div className="card-surface space-y-4 p-5 text-center">
            <SaveTag />
            <p className="text-sm text-muted-foreground">{t("communityDesc", lang)}</p>
            <Button asChild size="lg" className="w-full">
              <Link to="/auth">{t("sendCode", lang)}</Link>
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">{t("demoNote", lang)}</p>
        </div>
      </AppShell>
    );
  }

  const swap = () => setDraft({ from: draft.to, to: draft.from });

  const submit = () => {
    if (!draft.from || !draft.to || !draft.date) {
      setError(t("errRequired", lang));
      return;
    }
    if (draft.from === draft.to) {
      setError(t("errSameCity", lang));
      return;
    }
    setError(null);
    navigate({ to: "/options" });
  };

  return (
    <AppShell>
      <div className="bg-primary px-5 pb-10 pt-7 text-primary-foreground">
        <p className="text-sm opacity-80">
          {t("hello", lang)}، {user.name}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold">{t("bookTrip", lang)}</h1>
        <Link
          to="/wallet"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-sm"
        >
          <WalletIcon className="size-4" />
          {t("balance", lang)}: <span className="font-bold">{formatEGP(wallet, lang)}</span>
        </Link>
      </div>

      <div className="-mt-6 px-4">
        <div className="card-surface space-y-4 p-4">
          <div className="space-y-3">
            <CityField
              label={t("from", lang)}
              value={draft.from}
              exclude={draft.to}
              onChange={(v) => setDraft({ from: v })}
            />
            <div className="flex justify-center">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label={t("swap", lang)}
                onClick={swap}
                className="rounded-full"
              >
                <ArrowUpDown className="size-4" />
              </Button>
            </div>
            <CityField
              label={t("to", lang)}
              value={draft.to}
              exclude={draft.from}
              onChange={(v) => setDraft({ to: v })}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="date">{t("date", lang)}</Label>
            <input
              id="date"
              type="date"
              min={todayStr}
              value={draft.date ?? ""}
              onChange={(e) => setDraft({ date: e.target.value })}
              className="h-12 w-full rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-border p-3">
            <Checkbox
              checked={draft.airport}
              onCheckedChange={(v) => setDraft({ airport: Boolean(v) })}
              className="mt-0.5"
            />
            <span className="text-sm">
              <span className="font-semibold">{t("airport", lang)}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {t("maxRiders", lang)}: {maxRiders}
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-lg border border-border p-3">
            <Checkbox
              checked={draft.share}
              onCheckedChange={(v) => setDraft({ share: Boolean(v) })}
              className="mt-0.5"
            />
            <span className="flex-1 text-sm">
              <span className="flex items-center gap-2 font-semibold">
                {t("share", lang)} <SaveTag />
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {t("communityDesc", lang)}
              </span>
            </span>
          </label>

          {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

          <Button size="lg" className="w-full text-base" onClick={submit}>
            {t("explore", lang)}
          </Button>
        </div>

        <h2 className="mb-2 mt-6 px-1 text-sm font-bold text-muted-foreground">
          {t("quickLinks", lang)}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/community" className="card-surface flex flex-col gap-2 p-4">
            <Users className="size-5 text-primary" />
            <span className="text-sm font-bold">{t("community", lang)}</span>
            <span className="text-xs text-muted-foreground">{t("communityDesc", lang)}</span>
          </Link>
          <Link to="/returns" className="card-surface flex flex-col gap-2 p-4">
            <CornerUpLeft className="size-5 text-primary" />
            <span className="text-sm font-bold">{t("returns", lang)}</span>
            <span className="text-xs text-muted-foreground">{t("returnsDesc", lang)}</span>
          </Link>
        </div>

        <button
          onClick={() => toast(t("demoNote", lang))}
          className="mt-6 w-full text-center text-xs text-muted-foreground"
        >
          {t("demoNote", lang)}
        </button>
      </div>
    </AppShell>
  );
}

function CityField({
  label,
  value,
  exclude,
  onChange,
}: {
  label: string;
  value: CityId | null;
  exclude: CityId | null;
  onChange: (v: CityId) => void;
}) {
  const { lang } = useStore();
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value ?? ""} onValueChange={(v) => onChange(v as CityId)}>
        <SelectTrigger className="h-12 w-full text-base">
          <SelectValue placeholder={t("chooseCity", lang)} />
        </SelectTrigger>
        <SelectContent>
          {CITIES.filter((c) => c.id !== exclude).map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {cityName(c.id, lang)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
