import { createFileRoute } from "@tanstack/react-router";

import { AppShell, PageHeader } from "@/components/limo/AppShell";
import { formatAppDate } from "@/components/limo/DateField";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CAR_TIERS, cityName } from "@/lib/limo/data";
import { t } from "@/lib/limo/i18n";
import { formatEGP } from "@/lib/limo/pricing";
import { useStore, type Trip } from "@/lib/limo/store";

export const Route = createFileRoute("/trips")({
  head: () => ({
    meta: [
      { title: "رحلاتي — ليمو" },
      { name: "description", content: "رحلاتك القادمة والسابقة مع تفاصيل السيارة والسعر والحالة." },
      { property: "og:title", content: "رحلاتي — ليمو" },
      { property: "og:description", content: "متابعة الرحلات القادمة والسابقة." },
    ],
  }),
  component: TripsPage,
});

function TripsPage() {
  const { lang, trips } = useStore();
  const todayStr = new Date().toISOString().slice(0, 10);
  const upcoming = trips.filter((tr) => tr.date >= todayStr && tr.status !== "completed");
  const past = trips.filter((tr) => !(tr.date >= todayStr && tr.status !== "completed"));

  return (
    <AppShell>
      <PageHeader title={t("myTrips", lang)} />
      <div className="px-4">
         <Tabs defaultValue="upcoming" dir={lang === "ar" ? "rtl" : "ltr"}>
          <TabsList className="w-full">
            <TabsTrigger value="upcoming" className="flex-1">
              {t("upcoming", lang)}
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1">
              {t("past", lang)}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-3 space-y-3">
            <TripList trips={upcoming} />
          </TabsContent>
          <TabsContent value="past" className="mt-3 space-y-3">
            <TripList trips={past} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function TripList({ trips }: { trips: Trip[] }) {
  const { lang } = useStore();
  if (trips.length === 0) {
    return (
      <p className="card-surface p-8 text-center text-sm text-muted-foreground">
        {t("noTrips", lang)}
      </p>
    );
  }
  const statusLabel = {
    confirmed: t("statusConfirmed", lang),
    shared: t("statusShared", lang),
    completed: t("statusCompleted", lang),
    cancelled: t("statusCancelled", lang),
  } as const;

  return (
    <>
      {trips.map((tr) => {
        const tier = CAR_TIERS.find((c) => c.id === tr.tierId);
        return (
          <div key={tr.id} className="card-surface space-y-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-bold">
                {cityName(tr.from, lang)} ← {cityName(tr.to, lang)}
              </h3>
              <Badge
                variant={tr.status === "cancelled" ? "destructive" : "secondary"}
                className={tr.status === "shared" ? "bg-success/15 text-success" : undefined}
              >
                {statusLabel[tr.status]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
               {formatAppDate(tr.date, lang)} · {tier ? (lang === "ar" ? tier.ar : tier.en) : ""}
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">{t("paid", lang)}: </span>
              <span className="font-bold">{formatEGP(tr.paid, lang)}</span>
            </p>
          </div>
        );
      })}
    </>
  );
}
