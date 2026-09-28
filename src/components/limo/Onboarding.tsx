import { useState } from "react";
import { ArrowLeft, Car, Check } from "lucide-react";

import privateRideImage from "@/assets/onboarding-private.jpg";
import shareRideImage from "@/assets/onboarding-share.jpg";
import communityRideImage from "@/assets/onboarding-community.jpg";
import returnRideImage from "@/assets/onboarding-return.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: privateRideImage,
    title: "رحلتك الخاصة بين المدن",
    description: "احجز ليموزين خاص بين طنطا والقاهرة والإسكندرية والمنصورة وكفر الشيخ.",
  },
  {
    image: shareRideImage,
    title: "شارك رحلتك ووفّر",
    description: "افتح حجزك للمشاركة، ويمكن أن ينخفض نصيبك من التكلفة حتى 60٪.",
  },
  {
    image: communityRideImage,
    title: "انضم إلى رحلة مجتمعية",
    description: "ابحث عن رحلة مفتوحة للمشاركة وادفع سعر المقعد الحالي فقط.",
  },
  {
    image: returnRideImage,
    title: "رحلات عودة بسعر أقل",
    description: "استفد من خصومات كبيرة، مع واي فاي ومشروب مجاني في كل سيارة.",
  },
] as const;

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const last = index === slides.length - 1;
  const slide = slides[index];

  const move = (next: number) => setIndex(Math.max(0, Math.min(slides.length - 1, next)));

  return (
    <main
      className="flex min-h-screen flex-col overflow-hidden bg-background"
      dir="rtl"
      onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchStart === null) return;
        const end = event.changedTouches[0]?.clientX ?? touchStart;
        const distance = end - touchStart;
        if (Math.abs(distance) > 45) move(index + (distance > 0 ? 1 : -1));
        setTouchStart(null);
      }}
    >
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-2 font-extrabold text-primary">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Car className="size-5" />
          </span>
          ليمو
        </div>
        <Button variant="ghost" onClick={onComplete} className="text-muted-foreground">
          تخطي
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-5 pt-3">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-secondary">
          <img
            src={slide.image}
            alt=""
            width={1024}
            height={1024}
            className="size-full object-cover"
            draggable={false}
          />
        </div>
        <div className="min-h-40 pt-7 text-center" aria-live="polite">
          <h1 className="text-2xl font-extrabold text-foreground">{slide.title}</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
            {slide.description}
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-2" aria-label={`الشاشة ${index + 1} من 4`}>
          {slides.map((item, dotIndex) => (
            <span
              key={item.title}
              className={cn(
                "h-2 rounded-full transition-all",
                dotIndex === index ? "w-7 bg-primary" : "w-2 bg-border",
              )}
            />
          ))}
        </div>

        <Button
          size="lg"
          className="h-12 w-full text-base"
          onClick={() => (last ? onComplete() : move(index + 1))}
        >
          {last ? (
            <>
              ابدأ الآن <Check className="size-5" />
            </>
          ) : (
            <>
              التالي <ArrowLeft className="size-5" />
            </>
          )}
        </Button>
      </div>
    </main>
  );
}