import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, CalendarDays, Clock } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/limo/AppShell";
import { formatAppDate } from "@/components/limo/DateField";
import { SaveTag } from "@/components/limo/bits";
import { Button } from "@/components/ui/button";
import { CAR_TIERS, cityName } from "@/lib/limo/data";
import { t } from "@/lib/limo/i18n";
import { formatEGP, perSeat, riderCap } from "@/lib/limo/pricing";
import { useStore } from "@/lib/limo/store";
import type { CityId } from "@/lib/limo/data";

type CommunitySearch = { from: CityId | undefined; to: CityId | undefined; date: string | undefined };
const CITY_IDS: CityId[] = ["tanta", "cairo", "alexandria", "mansoura", "kafr"];

export const Route = createFileRoute("/community")({
  validateSearch: (search: Record<string, unknown>): CommunitySearch => ({
    from: CITY_IDS.includes(search["from"] as CityId) ? (search["from"] as CityId) : undefined,
    to: CITY_IDS.includes(search["to"] as CityId) ? (search["to"] as CityId) : undefined,
    date: typeof search["date"] === "string" && /^\d{4}-\d{2}-\d{2}$/.test(search["date"])
      ? search["date"]
      : undefined,
  }),
  head: () => ({
    meta: [
      { title: "رحلات المشاركة — ليمو" },
      {
        name: "description",
        content: "انضم لرحلة ليموزين محجوزة وشارك التكلفة مع ركاب آخرين ووفّر حتى 60%.",
      },
      { property: "og:title", content: "رحلات المشاركة — ليمو" },
      { property: "og:description", content: "شارك رحلة محجوزة وادفع سعر المقعد فقط." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  const { lang, shared, joinShared } = useStore();
  const search = Route.useSearch();
  const hasFilters = Boolean(search.from && search.to && search.date);
  const visibleTrips = shared.filter(
    (trip) =>
      (!search.from || trip.from === search.from) &&
      (!search.to || trip.to === search.to) &&
      (!search.date || trip.date === search.date),
  );

  return (
    <AppShell>
      <PageHeader title={t("community", lang)} subtitle={t("communityDesc", lang)} />

      <div className="space-y-3 px-4">
        {hasFilters ? (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary p-3 text-sm">
            <span className="font-semibold">{t("searchResults", lang)}</span>
            <Button asChild variant="ghost" size="sm">
              <Link to="/community" search={{ from: undefined, to: undefined, date: undefined }}>
                {t("clearSearch", lang)}
              </Link>
            </Button>
          </div>
        ) : null}

        {visibleTrips.length === 0 ? (
          <div className="card-surface flex flex-col items-center gap-3 p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
              <Users className="size-8" />
            </div>
            <p className="font-semibold">{t("emptyCommunity", lang)}</p>
            <p className="text-sm text-muted-foreground">{t("emptyCommunitySub", lang)}</p>
          </div>
        ) : null}

        {visibleTrips.map((trip) => {
          const cap = riderCap(trip.airport);
          const seatsLeft = cap - trip.riders;
          const priceIfJoin = perSeat(trip.base, trip.riders + 1);
          const tier = CAR_TIERS.find((c) => c.id === trip.tierId);
          if (!tier) return null;
          return (
            <div key={trip.id} className="card-surface space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold">
                    {cityName(trip.from, lang)} ← {cityName(trip.to, lang)}
                  </h3>
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" /> {formatAppDate(trip.date, lang)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" /> {trip.time}
                    </span>
                    <span>{lang === "ar" ? tier.ar : tier.en}</span>
                  </p>
                </div>
                <SaveTag />
              </div>

              <div className="flex items-end justify-between rounded-lg bg-secondary p-3">
                <div>
                  <p className="text-[11px] text-muted-foreground">{t("pricePerSeat", lang)}</p>
                  <p className="text-lg font-extrabold text-success">
                    {formatEGP(priceIfJoin, lang)}
                  </p>
                </div>
                <p className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <Users className="size-4" /> {seatsLeft} {t("seatsLeft", lang)}
                </p>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  joinShared(trip.id);
                  toast.success(t("joined", lang));
                }}
              >
                {t("joinNow", lang)} · {formatEGP(priceIfJoin, lang)}
              </Button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
