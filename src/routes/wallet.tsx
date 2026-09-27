import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, WalletMinimal } from "lucide-react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/limo/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { t } from "@/lib/limo/i18n";
import { formatEGP } from "@/lib/limo/pricing";
import { useStore } from "@/lib/limo/store";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "المحفظة — ليمو" },
      { name: "description", content: "رصيد محفظتك، شحن الرصيد، وسجل المعاملات وأرصدة المشاركة." },
      { property: "og:title", content: "المحفظة — ليمو" },
      { property: "og:description", content: "رصيد وشحن وسجل معاملات المحفظة." },
    ],
  }),
  component: WalletPage,
});

const METHODS = ["card", "fawry", "mobileWallet"] as const;

function WalletPage() {
  const { lang, wallet, txs, topUp } = useStore();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<(typeof METHODS)[number]>("card");

  const submit = () => {
    const value = Number(amount);
    if (!value || value <= 0 || value > 20000) {
      toast.error(lang === "ar" ? "أدخل مبلغاً صحيحاً" : "Enter a valid amount");
      return;
    }
    topUp(value, t(method, lang));
    setAmount("");
    toast.success(lang === "ar" ? "تم شحن الرصيد" : "Wallet topped up");
  };

  return (
    <AppShell>
      <PageHeader title={t("wallet", lang)} />

      <div className="space-y-4 px-4">
        <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-[var(--shadow-float)]">
          <p className="text-sm opacity-80">{t("balance", lang)}</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums">{formatEGP(wallet, lang)}</p>
          <WalletMinimal className="mt-3 size-6 opacity-70" />
        </div>

        <div className="card-surface space-y-4 p-4">
          <h2 className="text-base font-bold">{t("topUp", lang)}</h2>
          <div className="space-y-1.5">
            <Label htmlFor="amount">{t("amount", lang)}</Label>
            <Input
              id="amount"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 5))}
              className="h-12 text-base"
            />
          </div>
          <div className="flex gap-2">
            {[200, 500, 1000].map((v) => (
              <Button
                key={v}
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setAmount(String(v))}
              >
                {formatEGP(v, lang)}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label>{t("payMethod", lang)}</Label>
            <RadioGroup
              value={method}
              onValueChange={(v) => setMethod(v as (typeof METHODS)[number])}
              className="gap-2"
            >
              {METHODS.map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"
                >
                  <RadioGroupItem value={m} />
                  <span>{t(m, lang)}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
          <Button size="lg" className="w-full" onClick={submit}>
            {t("confirmTopUp", lang)}
          </Button>
        </div>

        <div className="card-surface p-4">
          <h2 className="mb-3 text-base font-bold">{t("history", lang)}</h2>
          {txs.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("noTx", lang)}</p>
          ) : (
            <ul className="divide-y divide-border">
              {txs.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="flex items-center gap-2 text-sm">
                    {tx.amount >= 0 ? (
                      <ArrowDownLeft className="size-4 text-success" />
                    ) : (
                      <ArrowUpRight className="size-4 text-muted-foreground" />
                    )}
                    <span>
                      <span className="block font-medium">{tx.label}</span>
                      <span className="block text-xs text-muted-foreground">{tx.date}</span>
                    </span>
                  </span>
                  <span
                    className={
                      tx.amount >= 0
                        ? "font-bold tabular-nums text-success"
                        : "font-bold tabular-nums"
                    }
                  >
                    {tx.amount >= 0 ? "+" : "−"} {formatEGP(Math.abs(tx.amount), lang)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
