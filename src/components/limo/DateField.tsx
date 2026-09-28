import { CalendarDays } from "lucide-react";
import { arSA, enUS } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { t, type Lang } from "@/lib/limo/i18n";
import { cn } from "@/lib/utils";

const fromIso = (value: string | null) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

const toIso = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function formatAppDate(value: string, lang: Lang) {
  const date = fromIso(value);
  if (!date) return value;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function DateField({
  value,
  onChange,
  lang,
}: {
  value: string | null;
  onChange: (value: string) => void;
  lang: Lang;
}) {
  const selected = fromIso(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-1.5">
      <Label>{t("date", lang)}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-12 w-full justify-start text-start text-base font-normal",
              !selected && "text-muted-foreground",
            )}
          >
            <CalendarDays className="size-4" />
            {selected ? formatAppDate(value ?? "", lang) : t("chooseDate", lang)}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0" dir={lang === "ar" ? "rtl" : "ltr"}>
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => date && onChange(toIso(date))}
            disabled={{ before: today }}
            locale={lang === "ar" ? arSA : enUS}
            dir={lang === "ar" ? "rtl" : "ltr"}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}