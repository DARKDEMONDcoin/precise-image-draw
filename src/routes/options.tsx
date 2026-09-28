import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, Users, Car } from "lucide-react";

import { AppShell, PageHeader } from "@/components/limo/AppShell";
import { Perks, SaveTag } from "@/components/limo/bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CAR_TIERS, basePrice, cityName } from "@/lib/limo/data";
import { t } from "@/lib/limo/i18n";
import { bestPrice, formatEGP, perSeat, riderCap, savingsPercent } from "@/lib/limo/pricing";
import { useStore } from "@/lib/limo/store";

export const Route = createFileRoute("/options")({
  head: () => ({
    meta: [
      { title: "اختر سيارتك — ليمو" },
      { name: "description", content: "قارن فئات السيارات والأسعار لرحلتك واختر الأنسب لك." },
      { property: "og:title", content: "اختر سيارتك — ليمو" },
      { property: "og:description", content: "فئات سيارات وأسعار لكل خط سير." },
    ],
  }),
  component: OptionsPage,
});

function OptionsPage() {
  const { lang, draft, setDraft } = useStore();
  const navigate = useNavigate();
  const ready = Boolean(draft.from && draft.to && draft.date);

  useEffect(() => {
    if (!ready) navigate({ to: "/" });
  }, [ready, navigate]);

  if (!ready || !draft.from || !draft.to) return null;

  const from = draft.from;
  const to = draft.to;
  const cap = riderCap(draft.airport);

  return (
    <AppShell>
      <PageHeader
        title={t("chooseCar", lang)}
        subtitle={`${cityName(from, lang)} ← ${cityName(to, lang)} · ${draft.date}`}
        action={
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              {t("back", lang)} <ArrowLeft className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        }
      />

      <div className="space-y-3 px-4">
        {CAR_TIERS.map((tier) => {
          const base = basePrice(from, to, tier);
          const shared2 = perSeat(base, 2);
          const low = bestPrice(base, draft.airport);
          return (
            <div key={tier.id} className="card-surface space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Car className="size-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold">{lang === "ar" ? tier.ar : tier.en}</h3>
                      {tier.premium ? (
                        <Badge className="bg-gold text-gold-foreground hover:bg-gold">
                          {lang === "ar" ? "فئة كبار الشخصيات" : "VIP"}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" ? tier.descAr : tier.descEn}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="size-3.5" /> {cap} {t("seats", lang)}
                    </p>
                  </div>
                </div>
                <div className="text-start">
                  {draft.share ? (
                    <>
                      <div className="text-xs text-muted-foreground line-through">
                        {formatEGP(base, lang)}
                      </div>
                      <div className="text-lg font-extrabold text-success">
                        {formatEGP(shared2, lang)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {t("sharedPrice", lang)}
                      </div>
                    </>
                  ) : (
                    <div className="text-lg font-extrabold">{formatEGP(base, lang)}</div>
                  )}
                </div>
              </div>

              <Perks />

              {draft.share ? (
                <div className="flex flex-wrap items-center gap-2 rounded-lg bg-success/10 p-2.5 text-xs font-medium text-success">
                  <SaveTag />
                  <span>
                    {t("couldDrop", lang)} {formatEGP(low, lang)} {t("ifOthersJoin", lang)} (
                    {savingsPercent(base, draft.airport)}%)
                  </span>
                </div>
              ) : null}

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  setDraft({ tierId: tier.id });
                  navigate({ to: "/checkout" });
                }}
              >
                {t("select", lang)}
              </Button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
