export const SHARE_PREMIUM = 200; // EGP added to trip total per extra rider

/** Total trip value for a given rider count. */
export const tripTotal = (base: number, riders: number) =>
  base + SHARE_PREMIUM * Math.max(0, riders - 1);

/** Even per-seat price, rounded to the nearest EGP. */
export const perSeat = (base: number, riders: number) =>
  Math.round(tripTotal(base, riders) / Math.max(1, riders));

/** Max riders allowed on a trip. */
export const riderCap = (airport: boolean) => (airport ? 2 : 3);

/** Lowest possible per-seat price if the trip fills up. */
export const bestPrice = (base: number, airport: boolean) =>
  perSeat(base, riderCap(airport));

export const savingsPercent = (base: number, airport: boolean) =>
  Math.round(((base - bestPrice(base, airport)) / base) * 100);

export const formatEGP = (n: number, lang: "ar" | "en") =>
  lang === "ar"
    ? `${Math.round(n).toLocaleString("ar-EG")} ج.م`
    : `EGP ${Math.round(n).toLocaleString("en-US")}`;
