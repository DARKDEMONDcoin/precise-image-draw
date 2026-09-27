import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Clock, Info } from "lucide-react";

import { AppShell, PageHeader } from "@/components/limo/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CAR_TIERS, cityName } from "@/lib/limo/data";
import { t } from "@/lib/limo/i18n";
import { formatEGP } from "@/lib/limo/pricing";
import { useStore } from "@/lib/limo/store";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "رحلات العودة — ليمو" },
      {
        name: "description",
        content: "احجز رحلة عودة فارغة بخصم يصل إلى 60% على خطوط السير بين المدن.",
      },
      { property: "og:title", content: "رحلات العودة — ليمو" },
      { property: "og:description", content: "رحلات عودة بخصم كبير بمواعيد تقريبية." },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  const { lang, returns, setDraft } = useStore();
  const navigate = useNavigate();

  return (
    <AppShell>
      <PageHeader title={t("returns", lang)} subtitle={t("returnsDesc", lang)} />

      <div className="space-y-3 px-4">
        <div className="flex items-start gap-2 rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <span>{t("approxNote", lang)}</span>
        </div>

        {returns.map((trip) => {
          const tier = CAR_TIERS.find((c) => c.id === trip.tierId)!;
          const off = Math.round((1 - trip.price / trip.base) * 100);
          return (
            <div key={trip.id} className="card-surface space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold">
                    {cityName(trip.from, lang)} ← {cityName(trip.to, lang)}
                  </h3>
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" /> {trip.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" /> {t("approxWindow", lang)}: {trip.window}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {lang === "ar" ? tier.ar : tier.en}
                  </p>
                </div>
                <Badge className="bg-gold text-gold-foreground hover:bg-gold">
                  {off}% {t("off", lang)}
                </Badge>
              </div>

              <div className="flex items-end gap-3">
                <span className="text-sm text-muted-foreground line-through">
                  {formatEGP(trip.base, lang)}
                </span>
                <span className="text-xl font-extrabold text-success">
                  {formatEGP(trip.price, lang)}
                </span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setDraft({
                    from: trip.from,
                    to: trip.to,
                    date: trip.date,
                    airport: false,
                    share: false,
                    tierId: trip.tierId,
                    returnTripId: trip.id,
                    fixedPrice: trip.price,
                  });
                  navigate({ to: "/checkout" });
                }}
              >
                {t("bookReturn", lang)}
              </Button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
