"use client";

import { useEffect, useMemo, useState } from "react";
import { profile } from "@/content/site";

// TODO: wire to booking backend. Receives ?date=YYYY-MM-DD&time=HH:MM.
const BOOKING_URL: string = "";

const TZ = "Europe/Brussels";
const DOWS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
] as const;
const WHATSAPP_MESSAGE =
  "Hi Stef, I found your portfolio and would like to discuss a possible collaboration.";

type Day = {
  date: Date;
  dayNum: number;
  dow: (typeof DOWS)[number];
  isWeekend: boolean;
  isToday: boolean;
  monthShort: (typeof MONTHS)[number];
};

type IconProps = {
  className?: string;
};

type ContactOption = {
  eyebrow: string;
  title: string;
  body: string;
  action: string;
  href: string;
  external: boolean;
  Icon: (props: IconProps) => React.ReactNode;
};

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.02 3.2C8.98 3.2 3.28 8.9 3.28 15.93c0 2.23.59 4.42 1.71 6.35L3.17 29l6.88-1.8a12.67 12.67 0 0 0 5.96 1.51h.01c7.03 0 12.74-5.7 12.74-12.73 0-3.4-1.33-6.6-3.73-9.01A12.66 12.66 0 0 0 16.02 3.2Zm.01 23.2h-.01c-1.9 0-3.76-.51-5.39-1.48l-.39-.23-4.08 1.07 1.09-3.98-.26-.41a10.38 10.38 0 0 1-1.6-5.44c0-5.86 4.77-10.62 10.64-10.62 2.84 0 5.5 1.1 7.51 3.11a10.55 10.55 0 0 1 3.11 7.52c0 5.86-4.76 10.62-10.62 10.62Zm5.83-7.96c-.32-.16-1.9-.94-2.2-1.04-.29-.11-.51-.16-.72.16-.21.31-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.84-1.59-1.89-1.78-2.21-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.36-.26-.62-.52-.53-.72-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.68s1.15 3.1 1.31 3.31c.16.21 2.27 3.46 5.49 4.85.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.54-.08-.13-.29-.21-.61-.37Z"
      />
    </svg>
  );
}

function EmailIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="4" y="5.5" width="16" height="15" rx="2" />
      <path d="M8 3.5v4" />
      <path d="M16 3.5v4" />
      <path d="M4 10h16" />
      <path d="M8 14h3" />
      <path d="M13 14h3" />
      <path d="M8 17h3" />
    </svg>
  );
}

function buildDays(now: Date): Day[] {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayParts = fmt.format(now);
  const [y, m, d] = todayParts.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d));
  const days: Day[] = [];
  for (let i = 0; i < 14; i++) {
    const dt = new Date(start.getTime() + i * 86400000);
    const dow = dt.getUTCDay();
    days.push({
      date: dt,
      dayNum: dt.getUTCDate(),
      dow: DOWS[dow],
      isWeekend: dow === 0 || dow === 6,
      isToday: i === 0,
      monthShort: MONTHS[dt.getUTCMonth()],
    });
  }
  return days;
}

// TODO: replace with real availability source (backend lookup).
// Pseudo-random placeholder — deterministic per date so render is stable.
function slotsForDay(day: Day): string[] {
  if (day.isWeekend) return [];
  const seed =
    day.date.getUTCFullYear() * 10000 +
    (day.date.getUTCMonth() + 1) * 100 +
    day.dayNum;
  const all = [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "13:00","13:30","14:00","14:30","15:00","15:30",
    "16:00","16:30","17:00",
  ];
  const out: string[] = [];
  for (let i = 0; i < all.length; i++) {
    const v = ((seed * (i + 7)) ^ (seed >> 3)) % 7;
    if (v < 3) out.push(all[i]);
  }
  return out;
}

export function Booking() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [activeDayIdx, setActiveDayIdx] = useState<number>(() => {
    const i = buildDays(new Date()).findIndex((d) => !d.isWeekend);
    return i >= 0 ? i : 0;
  });
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const days = useMemo(() => buildDays(now), [now]);
  const activeDay = days[activeDayIdx];
  const slots = useMemo(
    () => (activeDay ? slotsForDay(activeDay) : []),
    [activeDay],
  );
  const whatsappHref = `${profile.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  const contactOptions: ContactOption[] = [
    {
      eyebrow: "Fastest",
      title: "WhatsApp",
      body: "Direct chat. Quick response. Preferred method.",
      action: "Message me",
      href: whatsappHref,
      external: true,
      Icon: WhatsAppIcon,
    },
    {
      eyebrow: "Async",
      title: "Email",
      body: "Response guaranteed. Can take up to 48h.",
      action: "Send email",
      href: `mailto:${profile.email}`,
      external: false,
      Icon: EmailIcon,
    },
    {
      eyebrow: "Focused",
      title: "Calendar",
      body: "Use only when you're sure a call is required.",
      action: "Pick a slot",
      href: "#booking-calendar",
      external: false,
      Icon: CalendarIcon,
    },
  ];

  function handleConfirm() {
    if (!selected || !activeDay) return;
    if (!BOOKING_URL) return; // backend not wired yet
    const date = activeDay.date.toISOString().slice(0, 10);
    const sep = BOOKING_URL.includes("?") ? "&" : "?";
    const url = `${BOOKING_URL}${sep}date=${date}&time=${selected}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section
      id="booking"
      className="flex min-h-screen justify-center px-4 py-24 sm:px-8"
    >
      <div className="w-full max-w-[1080px]">
        <header className="mx-auto mb-12 max-w-[720px] text-center">
          <h2 className="mb-5 text-[40px] font-extrabold leading-none tracking-[-0.03em] sm:text-6xl md:text-[72px]">
            Let&apos;s work together.
          </h2>
          <p className="m-0 text-[18px] leading-[1.6] text-[#c8c9ca]">
            Open to software &amp; security roles. Preferrably remote and freelance
            engagements, but open to discuss anything.
          </p>
        </header>

        <div className="mb-7 grid gap-3 md:grid-cols-3">
          {contactOptions.map((option) => (
            <a
              key={option.title}
              href={option.href}
              target={option.external ? "_blank" : undefined}
              rel={option.external ? "noopener noreferrer" : undefined}
              className="group flex min-h-[172px] flex-col rounded-[18px] border border-[var(--line)] p-5 text-[var(--fg)] no-underline transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.006))",
              }}
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
                {option.eyebrow}
              </span>
              <div className="mt-8 flex items-stretch gap-4">
                <span className="flex min-h-16 w-16 shrink-0 items-center justify-center rounded-[16px] bg-[var(--accent)] text-[#0a0a0a] shadow-[0_0_46px_-12px_var(--glow)] ring-1 ring-white/20 transition duration-300 group-hover:scale-[1.04]">
                  <option.Icon className="h-8 w-8" />
                </span>
                <div className="min-w-0">
                  <h3 className="mb-2 text-[22px] font-bold tracking-[-0.02em]">
                    {option.title}
                  </h3>
                  <p className="m-0 text-[14px] leading-[1.55] text-[var(--muted)]">
                    {option.body}
                  </p>
                </div>
              </div>
              <span className="mt-auto inline-flex pt-6 text-[14px] font-semibold text-[var(--fg)] transition group-hover:text-[var(--accent)]">
                {option.action} →
              </span>
            </a>
          ))}
        </div>

        <section
          id="booking-calendar"
          className="rounded-[22px] border border-[var(--line)] p-5 sm:p-7"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
          }}
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-[7px] text-[13px] text-[var(--fg)]"
              style={{
                borderColor:
                  "color-mix(in oklch, var(--accent) 35%, transparent)",
              }}
            >
              <span className="live-dot" aria-hidden />
              <span>Easy schedule this week</span>
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dim)]">
              15-minute calendar
            </span>
          </div>

          {activeDay ? (
            <div suppressHydrationWarning>
              <div
                className="subtle-scrollbar mb-7 flex gap-1.5 overflow-x-auto pb-[1.3em]"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {days.map((d, i) => {
                  const has = slotsForDay(d).length > 0;
                  const isActive = i === activeDayIdx;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={!has}
                      onClick={() => {
                        setActiveDayIdx(i);
                        setSelected(null);
                      }}
                      className={`relative flex min-h-[108px] flex-[0_0_82px] flex-col items-center justify-start gap-1 rounded-[14px] border px-1.5 pt-2 pb-3 text-[var(--fg)] transition-all duration-200 ${
                        isActive
                          ? "bg-[color-mix(in_oklch,var(--accent)_12%,transparent)]"
                          : ""
                      } ${!has ? "cursor-not-allowed opacity-30" : "hover:-translate-y-px"}`}
                      style={{
                        scrollSnapAlign: "start",
                        borderColor: isActive
                          ? "var(--accent)"
                          : "var(--line)",
                        boxShadow: isActive ? "0 0 40px -10px var(--glow)" : "none",
                      }}
                    >
                      <span
                        className="rounded-[4px] px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-[0.22em]"
                        style={{
                          background: d.isToday ? "var(--accent)" : "transparent",
                          color: d.isToday ? "#0a0a0a" : "transparent",
                        }}
                      >
                        TODAY
                      </span>
                      <span
                        className="font-mono text-[10px] tracking-[0.18em]"
                        style={{ color: isActive ? "var(--accent)" : "var(--dim)" }}
                      >
                        {d.dow}
                      </span>
                      <span className="text-2xl font-bold tracking-[-0.02em]">
                        {d.dayNum}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--muted)]">
                        {d.monthShort}
                      </span>
                      <span
                        className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                        style={{ background: has ? "var(--accent)" : "var(--dim)" }}
                      />
                    </button>
                  );
                })}
              </div>

              <div>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div className="text-[18px] font-semibold">
                    {activeDay.dow}, {activeDay.monthShort} {activeDay.dayNum}
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--dim)]">
                    All times CET · Brussels
                  </span>
                  <div className="inline-flex items-center gap-1.5 font-mono text-[12px] text-[var(--muted)]">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                    15 min
                  </div>
                </div>

                {slots.length > 0 ? (
                  <div
                    className="mb-6 grid gap-2"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(110px, 1fr))",
                    }}
                  >
                    {slots.map((s) => {
                      const isSel = selected === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelected(s)}
                          className="rounded-[10px] border bg-transparent py-3 font-mono text-[14px] tracking-[0.04em] text-[var(--fg)] transition-all duration-200"
                          style={{
                            borderColor: isSel ? "var(--accent)" : "var(--line)",
                            background: isSel
                              ? "var(--accent)"
                              : "transparent",
                            color: isSel ? "#0a0a0a" : "var(--fg)",
                            boxShadow: isSel
                              ? "0 0 30px -10px var(--glow)"
                              : "none",
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mb-6 rounded-[10px] border border-dashed border-[var(--line)] p-8 text-center text-[14px] text-[var(--muted)]">
                    No availability — pick another day.
                  </div>
                )}

                <div className="flex justify-end border-t border-[var(--line)] pt-4">
                  <button
                    type="button"
                    disabled={!selected}
                    onClick={handleConfirm}
                    className="rounded-full border px-6 py-3.5 text-[15px] font-semibold transition-all duration-300 disabled:cursor-not-allowed"
                    style={
                      selected
                        ? {
                            background: "var(--accent)",
                            color: "#0a0a0a",
                            borderColor: "var(--accent)",
                            boxShadow: "0 0 60px -10px var(--glow)",
                          }
                        : {
                            background:
                              "color-mix(in oklch, var(--accent) 14%, transparent)",
                            borderColor:
                              "color-mix(in oklch, var(--accent) 30%, transparent)",
                            color: "var(--muted)",
                          }
                    }
                  >
                    {selected
                      ? `Confirm — ${activeDay.dow} ${activeDay.dayNum} ${activeDay.monthShort} · ${selected}`
                      : "Pick a time"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <footer className="mt-14 flex flex-wrap justify-center gap-8 text-[14px] text-[var(--muted)]">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:text-[var(--accent)]"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:text-[var(--accent)]"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="no-underline hover:text-[var(--accent)]"
          >
            Email
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:text-[var(--accent)]"
          >
            WhatsApp
          </a>
        </footer>
      </div>
    </section>
  );
}
