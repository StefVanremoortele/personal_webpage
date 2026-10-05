'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, useSyncExternalStore, type CSSProperties } from 'react';
import styles from './HeroReveal.module.css';

export type Highlight = {
  /** Screen-reader context, e.g. "Security · 2023—26" (the timeline shows this visually) */
  label: string;
  /** Pill text: the company, e.g. "Roularta Media Group" */
  text: string;
  /** Timeline group name. Consecutive highlights with the same name share one labelled segment. */
  segment: string;
  /** Start year (decimals allowed, e.g. 2023.5 = July 2023) */
  from: number;
  /** End year; omit for "now" */
  to?: number;
  /** Render the segment dashed (e.g. studies) */
  dashed?: boolean;
};

export type HeroRevealProps = {
  name?: string;
  roles?: string[];
  highlights?: Highlight[];
  avatarSrc?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Keep typing through the roles after the intro settles. */
  cycleRoles?: boolean;
};

const DEFAULTS: Required<HeroRevealProps> = {
  name: 'Stef Vanremoortele',
  roles: ['Software developer', 'Security specialist', 'Agentic developer'],
  highlights: [
    { label: 'Education · 2015—18', text: 'HOWEST Bruges', segment: 'Education', from: 2015, to: 2018, dashed: true },
    { label: 'Software development · 2018—20', text: 'Easypost', segment: 'Software development', from: 2018, to: 2020 },
    { label: 'Software development · 2020—21', text: 'Noordzee Helikopters Vlaanderen', segment: 'Software development', from: 2020, to: 2021 },
    { label: 'Software development · 2021—22', text: 'NineID', segment: 'Software development', from: 2021, to: 2022 },
    { label: 'Software development · 2022—23', text: 'Zora Robotics', segment: 'Software development', from: 2022, to: 2023 },
    { label: 'Security · 2023—26', text: 'Roularta Media Group', segment: 'Security', from: 2023, to: 2026 },
    { label: 'AI agentic · 2026', text: 'SIMIT', segment: 'AI agentic', from: 2026 },
  ],
  avatarSrc: '/avatar_me.png',
  ctaLabel: 'Get in contact',
  ctaHref: '#booking',
  cycleRoles: true,
};

// Timeline (ms) — mirrors the approved motion study.
const HIGHLIGHTS_START = 2600;
const HIGHLIGHT_SPAN = 850;
/** Roles in a multi-role category (software development) flash by; single-role categories linger. */
const LONG_SPAN = 1500;
/** Linger on the finished, fully lit timeline before the contact pills. */
const HOLD = 1200;

const SPARK_ANGLES = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];
/** End-burst sparks around the avatar. Switched off for now to preview the burst without them; set to true to restore. */
const SHOW_SPARKS = false;

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const noopSubscribe = () => () => {};

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** False on the server and during hydration, so markup matches. */
function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => false);
}

/** "Now" as year + month/12, resolved on the client only (null on the server and during hydration). */
function useYearNow() {
  return useSyncExternalStore<number | null>(
    noopSubscribe,
    () => {
      const d = new Date();
      return d.getFullYear() + d.getMonth() / 12;
    },
    () => null,
  );
}

/** -1 before highlights, 0..n-1 while highlight i shows, n when done (resting state). */
/** Start time (ms) of each highlight, plus the end of the last one as a final entry. */
function scheduleFor(highlights: Highlight[]) {
  const times = [HIGHLIGHTS_START];
  highlights.forEach((h, i) => {
    const shared = highlights.filter((o) => o.segment === h.segment).length > 1;
    times.push(times[i] + (shared ? HIGHLIGHT_SPAN : LONG_SPAN));
  });
  return times;
}

/** Drives the sequence; `summary` is the HOLD between the last highlight and done. */
function usePhase(times: number[], reduced: boolean) {
  const count = times.length - 1;
  const [phase, setPhase] = useState(-1);
  const [summary, setSummary] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const timers = times.map((at, i) => setTimeout(() => setPhase(i), at + (i === count ? HOLD : 0)));
    timers.push(setTimeout(() => setSummary(true), times[count]));
    return () => timers.forEach(clearTimeout);
  }, [times, count, reduced]);
  // Reduced motion: jump straight to the resting state.
  if (reduced) return { phase: count, summary: false };
  return { phase, summary };
}

function useTypedRoles(roles: string[], cycle: boolean, reduced: boolean) {
  const [idx, setIdx] = useState(0);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;
    const wait = (ms: number) => new Promise<void>((r) => { t = setTimeout(r, ms); });

    (async () => {
      await wait(900);
      if (cancelled) return;
      setIdx(0);
      setN(0);
      let i = 0;
      while (!cancelled) {
        const word = roles[i] ?? '';
        for (let c = 1; c <= word.length && !cancelled; c++) { setN(c); await wait(55); }
        if (cancelled || (!cycle && i === roles.length - 1)) return;
        await wait(2400);
        for (let c = word.length; c >= 0 && !cancelled; c--) { setN(c); await wait(28); }
        await wait(250);
        if (cancelled) return;
        i = (i + 1) % roles.length;
        setIdx(i);
      }
    })();

    return () => { cancelled = true; clearTimeout(t); };
  }, [roles, cycle, reduced]);

  // Reduced motion: land on the first role, fully typed.
  if (reduced) return { text: roles[0] ?? '', role: roles[0] ?? '', shown: true };
  const word = roles[idx] ?? '';
  return { text: word.slice(0, n), role: word, shown: n > 0 };
}

/** One matching outline icon per role (Lucide geometry), picked by keyword so custom roles still work. */
function RoleIcon({ role }: { role: string }) {
  const r = role.toLowerCase();
  if (/secur/.test(r)) return (<><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></>);
  if (/agent|orchestr|\bai\b/.test(r)) return (<><rect x="16" y="16" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" /><path d="M12 12V8" /></>);
  return (<><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></>);
}

export default function HeroReveal(props: HeroRevealProps) {
  const p = { ...DEFAULTS, ...props };
  const reduced = useReducedMotion();
  const typed = useTypedRoles(p.roles, p.cycleRoles, reduced);
  const count = p.highlights.length;
  const times = useMemo(() => scheduleFor(p.highlights), [p.highlights]);
  const { phase, summary } = usePhase(times, reduced);
  const done = phase >= count;

  // Resolve "now" on the client only, so server and client markup match.
  const now = useYearNow();
  const start = Math.min(...p.highlights.map((h) => h.from));
  const end = now ?? Math.max(...p.highlights.map((h) => h.to ?? h.from + 1));
  const pct = (y: number) => ((Math.min(y, end) - start) / (end - start)) * 100;

  const ticks = Array.from(new Set(p.highlights.map((h) => h.from)))
    .sort((a, b) => a - b)
    .map((y) => ({ at: pct(y), label: String(Math.floor(y)) }));

  // Consecutive highlights with the same segment name form one labelled group.
  const groups: { name: string; from: number; to: number; dashed?: boolean; idx: number[] }[] = [];
  p.highlights.forEach((h, i) => {
    const last = groups[groups.length - 1];
    const to = h.to ?? end;
    if (last && last.name === h.segment) { last.to = to; last.idx.push(i); }
    else groups.push({ name: h.segment, from: h.from, to, dashed: h.dashed, idx: [i] });
  });

  const markerAt =
    phase < 0 ? 0 : done || summary ? 100 : (pct(p.highlights[phase].from) + pct(p.highlights[phase].to ?? end)) / 2;

  return (
    <section
      id="hero"
      className={`snap-section ${styles.hero}`}
      data-done={done || undefined}
      data-summary={summary || undefined}
      aria-label="Introduction"
    >
      <div className={styles.glow} aria-hidden="true"><span /><span /><span /></div>

      <div className={styles.stage}>
        <div className={styles.avatar} data-glow={(phase >= Math.floor(count / 2) && !done) || undefined} data-burst={done || undefined}>
          {/* End moment (with the CTA morph): corona swirl + spark burst + ring flash (plays once via data-burst). */}
          <span className={styles.corona} aria-hidden="true" />
          {SHOW_SPARKS && (
            <span className={styles.sparks} aria-hidden="true">
              {SPARK_ANGLES.map((a, i) => (
                <span key={a} style={{ '--ang': `${a}deg`, '--d': `${((i * 37) % 10) * 10}ms` } as CSSProperties}><span /></span>
              ))}
            </span>
          )}
          {/* Mid-timeline: the ring's hues make one extra turn (subtle), via the ringTurn wrapper. */}
          <span className={styles.ringTurn} aria-hidden="true"><span className={styles.ring} /></span>
          <span className={styles.flash} aria-hidden="true" />
          <Image src={p.avatarSrc} alt={p.name} width={480} height={480} preload className={styles.photo} />
        </div>

        <p className={styles.eyebrow}>
          <svg key={typed.role} className={styles.badge} data-on={typed.shown || undefined} viewBox="0 0 24 24" aria-hidden="true">
            <RoleIcon role={typed.role} />
          </svg>
          <span className={styles.srOnly}>{p.roles.join(', ')}</span>
          <span className={styles.typed} aria-hidden="true">{typed.text}<span className={styles.caret}>_</span></span>
        </p>

        <h1 className={styles.name}>{p.name}</h1>

        <div className={styles.slot}>
          <ul className={styles.srOnly} aria-label="Experience highlights">
            {p.highlights.map((h, i) => <li key={h.label + i}>{h.label}: {h.text}</li>)}
          </ul>

          {/* One persistent pill; names roll through letter-by-letter and the width morphs (monospace → 1ch per letter). */}
          <div className={`${styles.chip} ${styles.roller}`} data-on={(phase >= 0 && !done && !summary) || undefined} aria-hidden="true">
            <span className={styles.sheen} key={'s' + phase} />
            <span className={styles.dot} key={'d' + phase} data-beat={phase >= 0 || undefined} />
            <span className={styles.window} style={{ '--len': (p.highlights[Math.min(Math.max(phase, 0), count - 1)]?.text ?? '').length } as CSSProperties}>
              {p.highlights.map((h, i) => (
                <span key={h.label + i} className={styles.word} data-first={i === 0 || undefined} data-state={i === phase && !summary ? 'active' : i <= phase ? 'past' : 'future'}>
                  {[...h.text].map((ch, k) => (
                    <span key={k} style={{ '--k': k } as CSSProperties}>{ch === ' ' ? '\u00a0' : ch}</span>
                  ))}
                </span>
              ))}
            </span>
          </div>

        </div>

        {/* Timeline and CTA share one grid cell: the CTA morphs out of the collapsing timeline, on the same line. */}
        <div className={styles.endRow}>
          <div className={styles.timeline} aria-hidden="true">
            <span className={styles.track} />
            {groups.map((g, gi) => {
              const a = pct(g.from), b = pct(g.to);
              return (
                <div
                  key={g.name + gi}
                  className={styles.seg}
                  data-active={g.idx.includes(phase) || undefined}
                  data-dashed={g.dashed || undefined}
                  style={{ '--a': `${a}%`, '--w': `${b - a}%`, '--i': gi } as CSSProperties}
                >
                  <span className={styles.segLabel} data-kind="group">{g.name}</span>
                  <span className={styles.bar}>
                    {g.idx.map((i) => {
                      const h = p.highlights[i];
                      const fa = ((pct(h.from) - a) / (b - a)) * 100;
                      const fb = ((pct(h.to ?? end) - a) / (b - a)) * 100;
                      return (
                        <span
                          key={i}
                          className={styles.fill}
                          data-active={i === phase || undefined}
                          style={{ '--a': `${fa}%`, '--w': `${fb - fa}%` } as CSSProperties}
                        />
                      );
                    })}
                  </span>
                </div>
              );
            })}
            {ticks.map((t) => (
              <span key={t.label} className={styles.tick} style={{ '--a': `${t.at}%` } as CSSProperties}><span>{t.label}</span></span>
            ))}
            <span className={`${styles.tick} ${styles.now}`} style={{ '--a': '100%' } as CSSProperties}><span>Now</span></span>
            <span className={styles.marker} data-on={phase >= 0 || undefined} style={{ '--a': `${markerAt}%` } as CSSProperties} />
          </div>
          <div className={styles.actions} aria-hidden={!done}>
            {/* Morph-in wrapper → float wrapper → rotating light border → button with shine. */}
            <div className={styles.ctaWrap}>
              <div className={styles.ctaFloat}>
                <a href={p.ctaHref} className={styles.ctaRing} tabIndex={done ? 0 : -1}>
                  <span className={styles.ctaSpin} aria-hidden="true" />
                  <span className={styles.cta}>
                    <span className={styles.ctaSheen} aria-hidden="true" />
                    <span className={styles.ctaLabel}>{p.ctaLabel}</span>
                  </span>
                </a>
              </div>
              <span className={styles.ctaShadow} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
