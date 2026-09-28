import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpDown, Users, CornerUpLeft, Wallet as WalletIcon, Car } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/limo/AppShell";
import { DateField } from "@/components/limo/DateField";
import { Onboarding } from "@/components/limo/Onboarding";
import { SaveTag } from "@/components/limo/bits";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { lang, user, draft, setDraft, wallet, onboardingSeen, completeOnboarding } = useStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [communityFrom, setCommunityFrom] = useState<CityId | null>(null);
  const [communityTo, setCommunityTo] = useState<CityId | null>(null);
  const [communityDate, setCommunityDate] = useState<string | null>(null);
  const [communityError, setCommunityError] = useState<string | null>(null);

  const maxRiders = draft.airport ? 2 : 3;
  if (!onboardingSeen && !user) {
    return (
      <AppShell nav={false}>
        <Onboarding onComplete={completeOnboarding} />
      </AppShell>
    );
  }

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

  const searchCommunity = () => {
    if (!communityFrom || !communityTo || !communityDate) {
      setCommunityError(t("errRequired", lang));
      return;
    }
    if (communityFrom === communityTo) {
      setCommunityError(t("errSameCity", lang));
      return;
    }
    setCommunityError(null);
    navigate({
      to: "/community",
      search: { from: communityFrom, to: communityTo, date: communityDate },
    });
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
        <Tabs defaultValue="new" dir={lang === "ar" ? "rtl" : "ltr"}>
          <TabsList className="mb-3 h-12 w-full bg-card p-1 shadow-card">
            <TabsTrigger value="new" className="h-10 flex-1">
              {t("newBooking", lang)}
            </TabsTrigger>
            <TabsTrigger value="community" className="h-10 flex-1">
              {t("communitySearch", lang)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-0">
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
                    <ArrowUpDown className="size-4 rtl:-scale-x-100" />
                  </Button>
                </div>
                <CityField
                  label={t("to", lang)}
                  value={draft.to}
                  exclude={draft.from}
                  onChange={(v) => setDraft({ to: v })}
                />
              </div>

              <DateField value={draft.date} onChange={(date) => setDraft({ date })} lang={lang} />

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
                  <span className="flex flex-wrap items-center gap-2 font-semibold">
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
          </TabsContent>

          <TabsContent value="community" className="mt-0">
            <div className="card-surface space-y-4 p-4">
              <p className="text-sm text-muted-foreground">{t("communitySearchHint", lang)}</p>
              <CityField
                label={t("from", lang)}
                value={communityFrom}
                exclude={communityTo}
                onChange={setCommunityFrom}
              />
              <CityField
                label={t("to", lang)}
                value={communityTo}
                exclude={communityFrom}
                onChange={setCommunityTo}
              />
              <DateField value={communityDate} onChange={setCommunityDate} lang={lang} />
              {communityError ? (
                <p className="text-sm font-medium text-destructive">{communityError}</p>
              ) : null}
              <Button size="lg" className="w-full text-base" onClick={searchCommunity}>
                <Users className="size-5" /> {t("searchRides", lang)}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

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

        <Button
          variant="ghost"
          onClick={() => toast(t("demoNote", lang))}
          className="mt-6 w-full text-center text-xs text-muted-foreground"
        >
          {t("demoNote", lang)}
        </Button>
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
