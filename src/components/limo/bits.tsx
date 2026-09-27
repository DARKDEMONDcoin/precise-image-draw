import { Wifi, CupSoda } from "lucide-react";
import { useStore } from "@/lib/limo/store";
import { t } from "@/lib/limo/i18n";
import { cn } from "@/lib/utils";

export function SaveTag({ className }: { className?: string }) {
  const { lang } = useStore();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-gold-foreground",
        className,
      )}
    >
      {t("saveTag", lang)}
    </span>
  );
}

export function Perks() {
  const { lang } = useStore();
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
        <Wifi className="size-3.5" /> {t("wifi", lang)}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
        <CupSoda className="size-3.5" /> {t("drink", lang)}
      </span>
    </div>
  );
}

export function Money({ value, className }: { value: string; className?: string }) {
  return <span className={cn("font-bold tabular-nums", className)}>{value}</span>;
}
