import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Car } from "lucide-react";

import { AppShell } from "@/components/limo/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { t } from "@/lib/limo/i18n";
import { useStore } from "@/lib/limo/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — ليمو" },
      { name: "description", content: "سجّل الدخول برقم موبايلك واستقبل كود التأكيد." },
      { property: "og:title", content: "تسجيل الدخول — ليمو" },
      { property: "og:description", content: "تسجيل الدخول برقم الموبايل وكود التأكيد." },
    ],
  }),
  component: AuthPage,
});

type Step = "phone" | "otp" | "profile";

function AuthPage() {
  const { lang, setUser } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sendCode = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError(t("invalidPhone", lang));
      return;
    }
    setError(null);
    const generated = String(Math.floor(1000 + Math.random() * 9000));
    setDemoCode(generated);
    setCode("");
    setStep("otp");
  };

  const verify = (value: string) => {
    if (value !== demoCode) {
      setError(t("wrongCode", lang));
      return;
    }
    setError(null);
    setStep("profile");
  };

  const finish = () => {
    if (!name.trim()) {
      setError(t("enterName", lang));
      return;
    }
    setUser({
      phone: `+20${phone.replace(/\D/g, "")}`,
      name: name.trim(),
      email: email.trim(),
      riderScore: 5,
    });
    navigate({ to: "/" });
  };

  return (
    <AppShell nav={false}>
      <div className="flex min-h-screen flex-col px-6 pb-10 pt-12">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Car className="size-6" />
          </div>
          <span className="text-xl font-extrabold">{t("appName", lang)}</span>
        </div>

        {step === "phone" ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{t("phoneTitle", lang)}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t("phoneHint", lang)}</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("phone", lang)}</Label>
              <div className="flex items-center gap-2">
                <span className="flex h-14 items-center rounded-lg border border-input bg-secondary px-3 text-base font-semibold">
                  +20
                </span>
                <Input
                  id="phone"
                  inputMode="numeric"
                  dir="ltr"
                  placeholder={t("phonePlaceholder", lang)}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="h-14 flex-1 text-right text-lg tabular-nums"
                />
              </div>
            </div>
            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
            <Button size="lg" className="w-full text-base" onClick={sendCode}>
              {t("sendCode", lang)} <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
          </div>
        ) : null}

        {step === "otp" ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{t("otpTitle", lang)}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("otpSentTo", lang)} <span dir="ltr">+20{phone}</span>
              </p>
            </div>
            <div dir="ltr" className="flex justify-center">
              <InputOTP
                maxLength={4}
                value={code}
                onChange={(v) => {
                  setCode(v);
                  if (v.length === 4) verify(v);
                }}
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3].map((i) => (
                    <InputOTPSlot key={i} index={i} className="size-14 text-xl" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="rounded-lg bg-secondary p-3 text-center text-sm">
              <span className="text-muted-foreground">{t("demoCode", lang)}: </span>
              <span dir="ltr" className="text-lg font-bold tabular-nums">{demoCode}</span>
            </div>
            {error ? (
              <p className="text-center text-sm font-medium text-destructive">{error}</p>
            ) : null}
            <Button size="lg" className="w-full text-base" onClick={() => verify(code)}>
              {t("verify", lang)}
            </Button>
            <button
              className="w-full text-sm text-muted-foreground underline"
              onClick={sendCode}
              type="button"
            >
              {t("resend", lang)}
            </button>
          </div>
        ) : null}

        {step === "profile" ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold">{t("profileTitle", lang)}</h1>
            <div className="space-y-1.5">
              <Label htmlFor="name">{t("name", lang)}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 60))}
                className="h-14 text-right text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("email", lang)}</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value.slice(0, 120))}
                className="h-14 text-base"
              />
            </div>
            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
            <Button size="lg" className="w-full text-base" onClick={finish}>
              {t("save", lang)}
            </Button>
          </div>
        ) : null}

        <p className="mt-auto pt-10 text-center text-xs text-muted-foreground">
          {t("demoNote", lang)}
        </p>
      </div>
    </AppShell>
  );
}
