import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/limo/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { t } from "@/lib/limo/i18n";
import { useStore } from "@/lib/limo/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات — ليمو" },
      { name: "description", content: "غيّر لغة التطبيق، الإشعارات، واحصل على المساعدة والدعم." },
      { property: "og:title", content: "الإعدادات — ليمو" },
      { property: "og:description", content: "اللغة والإشعارات والدعم في تطبيق ليمو." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { lang, setLang, notifications, setNotifications } = useStore();

  return (
    <AppShell>
      <PageHeader title={t("settings", lang)} />
      <div className="space-y-4 px-4">
        <div className="card-surface space-y-3 p-4">
          <p className="text-sm font-bold">{t("language", lang)}</p>
          <div className="grid grid-cols-2 gap-2">
            {(["ar", "en"] as const).map((l) => (
              <Button
                key={l}
                onClick={() => setLang(l)}
                variant={lang === l ? "default" : "outline"}
                className={cn("h-12", lang === l && "border-primary")}
              >
                {l === "ar" ? "العربية" : lang === "ar" ? "الإنجليزية" : "English"}
              </Button>
            ))}
          </div>
        </div>

        <div className="card-surface flex items-center justify-between p-4">
          <span className="text-sm font-bold">{t("notifications", lang)}</span>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => toast(t("supportPhone", lang))}
        >
          <LifeBuoy className="size-4" /> {t("help", lang)}
        </Button>

        <p className="pt-2 text-center text-xs text-muted-foreground">{t("demoNote", lang)}</p>
      </div>
    </AppShell>
  );
}
