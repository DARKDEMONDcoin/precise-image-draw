export type CityId = "tanta" | "cairo" | "alexandria" | "mansoura" | "kafr";

export const CITIES: { id: CityId; ar: string; en: string }[] = [
  { id: "tanta", ar: "طنطا", en: "Tanta" },
  { id: "cairo", ar: "القاهرة", en: "Cairo" },
  { id: "alexandria", ar: "الإسكندرية", en: "Alexandria" },
  { id: "mansoura", ar: "المنصورة", en: "Mansoura" },
  { id: "kafr", ar: "كفر الشيخ", en: "Kafr El Sheikh" },
];

export const cityName = (id: CityId, lang: "ar" | "en") =>
  CITIES.find((c) => c.id === id)?.[lang] ?? id;

/** Placeholder route distances (km) used to derive placeholder base fares. */
const DIST: Record<string, number> = {
  "tanta|cairo": 95,
  "tanta|alexandria": 130,
  "tanta|mansoura": 60,
  "tanta|kafr": 55,
  "cairo|alexandria": 220,
  "cairo|mansoura": 130,
  "cairo|kafr": 150,
  "alexandria|mansoura": 160,
  "alexandria|kafr": 100,
  "mansoura|kafr": 70,
};

export const routeDistance = (from: CityId, to: CityId) =>
  DIST[`${from}|${to}`] ?? DIST[`${to}|${from}`] ?? 100;

export type CarTier = {
  id: string;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
  seats: number;
  multiplier: number;
  premium?: boolean;
};

/** Placeholder tiers & pricing — real names/prices to be supplied later. */
export const CAR_TIERS: CarTier[] = [
  {
    id: "economy",
    ar: "اقتصادي",
    en: "Economy",
    descAr: "سيارة سيدان مريحة",
    descEn: "Comfortable sedan",
    seats: 3,
    multiplier: 1,
  },
  {
    id: "comfort",
    ar: "كومفورت",
    en: "Comfort",
    descAr: "مساحة أكبر وسائق خبرة",
    descEn: "More space, senior driver",
    seats: 3,
    multiplier: 1.35,
  },
  {
    id: "vip",
    ar: "في آي بي",
    en: "VIP",
    descAr: "سيارة فاخرة وخدمة مميزة",
    descEn: "Luxury car, premium service",
    seats: 3,
    multiplier: 1.9,
    premium: true,
  },
];

/** Placeholder base solo fare for a route + tier, rounded to nearest 50 EGP. */
export function basePrice(from: CityId, to: CityId, tier: CarTier) {
  const raw = 300 + routeDistance(from, to) * 7 * tier.multiplier;
  return Math.round(raw / 50) * 50;
}

export const RETURN_DISCOUNT = 0.6; // placeholder: 60% off (range 50–70%)
