import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/limo/AppShell";
import { formatAppDate } from "@/components/limo/DateField";
import { Perks, SaveTag } from "@/components/limo/bits";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CAR_TIERS, basePrice, cityName } from "@/lib/limo/data";
import { t } from "@/lib/limo/i18n";
import { bestPrice, formatEGP, perSeat } from "@/lib/limo/pricing";
import { useStore } from "@/lib/limo/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "ملخص الحجز — ليمو" },
      { name: "description", content: "راجع تفاصيل رحلتك، استخدم رصيد محفظتك وأكّد الحجز." },
      { property: "og:title", content: "ملخص الحجز — ليمو" },
      { property: "og:description", content: "مراجعة الحجز والدفع باستخدام المحفظة." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { lang, draft, wallet, book } = useStore();
  const navigate = useNavigate();
  const [useWallet, setUseWallet] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const ready = Boolean(draft.from && draft.to && draft.date && draft.tierId);

  useEffect(() => {
    if (!ready && !submitted) navigate({ to: "/" });
  }, [ready, submitted, navigate]);

  if (!ready || !draft.from || !draft.to || !draft.tierId) return null;

  const tier = CAR_TIERS.find((c) => c.id === draft.tierId);
  if (!tier) return null;
  const base = draft.fixedPrice ?? basePrice(draft.from, draft.to, tier);
  const total = base;
  const walletUsed = useWallet ? Math.min(wallet, total) : 0;
  const remaining = total - walletUsed;

  const confirm = () => {
    setSubmitted(true);
    book({ tierId: tier.id, base, paid: total, walletUsed });
    toast.success(t("booked", lang));
    navigate({ to: "/trips" });
  };

  return (
    <AppShell>
      <PageHeader
        title={t("summary", lang)}
        action={
          <Button asChild variant="ghost" size="sm">
            <Link to="/options">
              {t("back", lang)} <ArrowLeft className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        }
      />

      <div className="space-y-4 px-4">
        <div className="card-surface space-y-3 p-4">
          <Row label={t("route", lang)}>
            {cityName(draft.from, lang)} ← {cityName(draft.to, lang)}
          </Row>
          <Row label={t("date", lang)}>{formatAppDate(draft.date, lang)}</Row>
          <Row label={t("car", lang)}>{lang === "ar" ? tier.ar : tier.en}</Row>
          <Row label={t("maxRiders", lang)}>{draft.airport ? 2 : 3}</Row>
          <Perks />
        </div>

        {draft.share ? (
          <div className="card-surface space-y-2 border-success/30 bg-success/5 p-4">
            <SaveTag />
            <p className="text-sm font-medium text-success">
              {t("couldDrop", lang)} {formatEGP(bestPrice(base, draft.airport), lang)}{" "}
              {t("ifOthersJoin", lang)}
            </p>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? `لو انضم راكب تاني هيبقى نصيبك ${formatEGP(perSeat(base, 2), lang)} ويترد الفرق لمحفظتك تلقائياً.`
                : `If a second rider joins, your share becomes ${formatEGP(perSeat(base, 2), lang)} and the difference is credited to your wallet automatically.`}
            </p>
          </div>
        ) : null}

        <div className="card-surface space-y-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{t("useWallet", lang)}</span>
            <Switch checked={useWallet} onCheckedChange={setUseWallet} />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{t("balance", lang)}</span>
            <span>{formatEGP(wallet, lang)}</span>
          </div>
          <Button asChild variant="secondary" size="sm" className="w-full">
            <Link to="/wallet">{t("topUp", lang)}</Link>
          </Button>
        </div>

        <div className="card-surface space-y-2 p-4">
          <div className="flex items-center justify-between text-sm">
            <span>{t("total", lang)}</span>
            <span className="font-bold">{formatEGP(total, lang)}</span>
          </div>
          {walletUsed > 0 ? (
            <div className="flex items-center justify-between text-sm text-success">
              <span>{t("walletApplied", lang)}</span>
              <span className="font-bold">− {formatEGP(walletUsed, lang)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between border-t border-border pt-2 text-base font-extrabold">
            <span>{t("remaining", lang)}</span>
            <span>{formatEGP(remaining, lang)}</span>
          </div>
        </div>

        <Button size="lg" className="w-full text-base" onClick={confirm}>
          <CheckCircle2 className="size-5" /> {t("payNow", lang)}
        </Button>
      </div>
    </AppShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{children}</span>
    </div>
  );
}
