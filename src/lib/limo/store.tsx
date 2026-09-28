import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CAR_TIERS, basePrice, type CityId } from "./data";
import { perSeat, riderCap } from "./pricing";
import type { Lang } from "./i18n";

export type User = { phone: string; name: string; email?: string; riderScore: number };

/** Reserved for the future approval flow; joining remains immediate in this prototype. */
export type JoinRequest = {
  id: string;
  tripId: string;
  rider: Pick<User, "phone" | "name" | "riderScore">;
  status: "pending" | "accepted" | "rejected";
  requestedAt: string;
};

export type Draft = {
  from: CityId | null;
  to: CityId | null;
  date: string | null;
  airport: boolean;
  share: boolean;
  tierId?: string;
  returnTripId?: string;
  fixedPrice?: number;
};

export type SharedTrip = {
  id: string;
  from: CityId;
  to: CityId;
  date: string;
  time: string;
  tierId: string;
  airport: boolean;
  base: number;
  riders: number;
  mine?: boolean;
};

export type ReturnTrip = {
  id: string;
  from: CityId;
  to: CityId;
  date: string;
  window: string;
  tierId: string;
  base: number;
  price: number;
};

export type Trip = {
  id: string;
  from: CityId;
  to: CityId;
  date: string;
  tierId: string;
  paid: number;
  status: "confirmed" | "shared" | "completed" | "cancelled";
  shared: boolean;
  airport: boolean;
  base: number;
  riders: number;
};

export type Tx = { id: string; label: string; amount: number; date: string };

type State = {
  lang: Lang;
  user: User | null;
  draft: Draft;
  wallet: number;
  txs: Tx[];
  trips: Trip[];
  shared: SharedTrip[];
  returns: ReturnTrip[];
  notifications: boolean;
  onboardingSeen: boolean;
};

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const plus = (n: number) => iso(new Date(today.getTime() + n * 86400000));

const mkShared = (
  id: string,
  from: CityId,
  to: CityId,
  days: number,
  time: string,
  tierId: string,
  airport: boolean,
  riders: number,
): SharedTrip => ({
  id,
  from,
  to,
  date: plus(days),
  time,
  tierId,
  airport,
  riders,
  base: basePrice(from, to, CAR_TIERS.find((c) => c.id === tierId)!),
});

const mkReturn = (
  id: string,
  from: CityId,
  to: CityId,
  days: number,
  window: string,
  tierId: string,
): ReturnTrip => {
  const base = basePrice(from, to, CAR_TIERS.find((c) => c.id === tierId)!);
  return { id, from, to, date: plus(days), window, tierId, base, price: Math.round((base * 0.4) / 10) * 10 };
};

const initial: State = {
  lang: "ar",
  user: null,
  draft: { from: null, to: null, date: null, airport: false, share: false },
  wallet: 350,
  txs: [
    { id: "t1", label: "شحن رصيد", amount: 500, date: plus(-6) },
    { id: "t2", label: "رحلة طنطا ← القاهرة", amount: -150, date: plus(-4) },
  ],
  trips: [
    {
      id: "p1",
      from: "tanta",
      to: "cairo",
      date: plus(-4),
      tierId: "comfort",
      paid: 950,
      status: "completed",
      shared: false,
      airport: false,
      base: 950,
      riders: 1,
    },
  ],
  shared: [
    mkShared("s1", "tanta", "cairo", 1, "08:30", "comfort", false, 1),
    mkShared("s2", "cairo", "alexandria", 2, "14:00", "economy", false, 2),
    mkShared("s3", "mansoura", "cairo", 3, "06:00", "vip", true, 1),
    mkShared("s4", "kafr", "alexandria", 4, "17:15", "economy", false, 1),
  ],
  returns: [
    mkReturn("r1", "cairo", "tanta", 1, "18:00 – 21:00", "comfort"),
    mkReturn("r2", "alexandria", "cairo", 2, "13:00 – 16:00", "vip"),
    mkReturn("r3", "cairo", "mansoura", 3, "20:00 – 23:00", "economy"),
  ],
  notifications: true,
  onboardingSeen: false,
};

const KEY = "limo-state-v1";

type Ctx = State & {
  lang: Lang;
  setLang: (l: Lang) => void;
  setUser: (u: User | null) => void;
  setDraft: (d: Partial<Draft>) => void;
  resetDraft: () => void;
  setNotifications: (v: boolean) => void;
  completeOnboarding: () => void;
  topUp: (amount: number, method: string) => void;
  book: (args: { tierId: string; base: number; paid: number; walletUsed: number }) => void;
  joinShared: (id: string) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<State>;
        const user = saved.user ? { ...saved.user, riderScore: saved.user.riderScore ?? 5 } : null;
        setState({ ...initial, ...saved, user });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  useEffect(() => {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
  }, [state.lang]);

  const setLang = useCallback((lang: Lang) => setState((s) => ({ ...s, lang })), []);
  const setUser = useCallback((user: User | null) => setState((s) => ({ ...s, user })), []);
  const setDraft = useCallback(
    (d: Partial<Draft>) => setState((s) => ({ ...s, draft: { ...s.draft, ...d } })),
    [],
  );
  const resetDraft = useCallback(() => setState((s) => ({ ...s, draft: initial.draft })), []);
  const setNotifications = useCallback(
    (notifications: boolean) => setState((s) => ({ ...s, notifications })),
    [],
  );
  const completeOnboarding = useCallback(
    () => setState((s) => ({ ...s, onboardingSeen: true })),
    [],
  );

  const topUp = useCallback((amount: number, method: string) => {
    setState((s) => ({
      ...s,
      wallet: s.wallet + amount,
      txs: [
        { id: crypto.randomUUID(), label: `${method}`, amount, date: iso(new Date()) },
        ...s.txs,
      ],
    }));
  }, []);

  const book = useCallback<Ctx["book"]>(({ tierId, base, paid, walletUsed }) => {
    setState((s) => {
      const d = s.draft;
      const trip: Trip = {
        id: crypto.randomUUID(),
        from: d.from ?? "tanta",
        to: d.to ?? "cairo",
        date: d.date ?? iso(new Date()),
        tierId,
        paid,
        status: d.share ? "shared" : "confirmed",
        shared: d.share,
        airport: d.airport,
        base,
        riders: 1,
      };
      const shared = d.share
        ? [
            {
              id: trip.id,
              from: trip.from,
              to: trip.to,
              date: trip.date,
              time: "09:00",
              tierId,
              airport: trip.airport,
              base,
              riders: 1,
              mine: true,
            } as SharedTrip,
            ...s.shared,
          ]
        : s.shared;
      return {
        ...s,
        trips: [trip, ...s.trips],
        shared,
        wallet: s.wallet - walletUsed,
        txs: walletUsed
          ? [
              {
                id: crypto.randomUUID(),
                label: "دفع رحلة",
                amount: -walletUsed,
                date: iso(new Date()),
              },
              ...s.txs,
            ]
          : s.txs,
        draft: initial.draft,
      };
    });
  }, []);

  const joinShared = useCallback((id: string) => {
    setState((s) => {
      const st = s.shared.find((x) => x.id === id);
      if (!st) return s;
      const nextRiders = st.riders + 1;
      const price = perSeat(st.base, nextRiders);
      const full = nextRiders >= riderCap(st.airport);

      // Automatic wallet credit for the original booker if that booking is mine.
      let wallet = s.wallet;
      let txs = s.txs;
      const trips = s.trips.map((tr) => {
        if (tr.id !== id) return tr;
        const oldShare = perSeat(tr.base, tr.riders);
        const newShare = perSeat(tr.base, nextRiders);
        const credit = Math.max(0, oldShare - newShare);
        if (credit > 0) {
          wallet += credit;
          txs = [
            {
              id: crypto.randomUUID(),
              label: "رصيد مشاركة رحلة",
              amount: credit,
              date: iso(new Date()),
            },
            ...txs,
          ];
        }
        return { ...tr, riders: nextRiders, paid: newShare, status: "shared" as const };
      });

      const joined: Trip | null = st.mine
        ? null
        : {
            id: crypto.randomUUID(),
            from: st.from,
            to: st.to,
            date: st.date,
            tierId: st.tierId,
            paid: price,
            status: "shared",
            shared: true,
            airport: st.airport,
            base: st.base,
            riders: nextRiders,
          };

      return {
        ...s,
        wallet,
        txs: joined
          ? [
              {
                id: crypto.randomUUID(),
                label: "دفع رحلة مشاركة",
                amount: -price,
                date: iso(new Date()),
              },
              ...txs,
            ]
          : txs,
        trips: joined ? [joined, ...trips] : trips,
        shared: full
          ? s.shared.filter((x) => x.id !== id)
          : s.shared.map((x) => (x.id === id ? { ...x, riders: nextRiders } : x)),
      };
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      setLang,
      setUser,
      setDraft,
      resetDraft,
      setNotifications,
      completeOnboarding,
      topUp,
      book,
      joinShared,
    }),
    [
      state,
      setLang,
      setUser,
      setDraft,
      resetDraft,
      setNotifications,
      completeOnboarding,
      topUp,
      book,
      joinShared,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
