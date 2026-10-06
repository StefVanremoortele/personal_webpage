'use client';

import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';
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
  availability?: string;
  availabilityHref?: string;
  /** Keep typing through the roles after the intro settles. */
  cycleRoles?: boolean;
};

const DEFAULTS: Required<HeroRevealProps> = {
  name: 'Stef Vanremoortele',
  roles: ['Software developer', 'Security specialist', 'Agentic orchestrator'],
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
  availability: 'Open to software & security roles',
  availabilityHref: '#booking',
  cycleRoles: true,
};

// Timeline (ms) — mirrors the approved motion study.
const HIGHLIGHTS_START = 2600;
const HIGHLIGHT_SPAN = 850;
/** Roles in a multi-role category (software development) flash by; single-role categories linger. */
const LONG_SPAN = 1500;
/** Linger on the finished, fully lit timeline before the contact pills. */
const HOLD = 1200;

const yearNow = () => {
  const d = new Date();
  return d.getFullYear() + d.getMonth() / 12;
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
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

function usePhase(times: number[], reduced: boolean) {
  const count = times.length - 1;
  const [phase, setPhase] = useState(-1);
  useEffect(() => {
    if (reduced) { setPhase(count); return; }
    const timers = times.map((at, i) => setTimeout(() => setPhase(i), at + (i === count ? HOLD : 0)));
    return () => timers.forEach(clearTimeout);
  }, [times.join(','), reduced]);
  return phase;
}

function useTypedRoles(roles: string[], cycle: boolean, reduced: boolean) {
  const [idx, setIdx] = useState(0);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced) { setIdx(0); setN(roles[0]?.length ?? 0); return; }
    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;
    const wait = (ms: number) => new Promise<void>((r) => { t = setTimeout(r, ms); });

    (async () => {
      await wait(900);
      let i = 0;
      while (!cancelled) {
        const word = roles[i] ?? '';
        for (let c = 1; c <= word.length && !cancelled; c++) { setN(c); await wait(55); }
        if (!cycle && i === roles.length - 1) return;
        await wait(2400);
        for (let c = word.length; c >= 0 && !cancelled; c--) { setN(c); await wait(28); }
        await wait(250);
        i = (i + 1) % roles.length;
        setIdx(i);
      }
    })();

    return () => { cancelled = true; clearTimeout(t); };
  }, [roles, cycle, reduced]);

  return (roles[idx] ?? '').slice(0, n);
}

export default function HeroReveal(props: HeroRevealProps) {
  const p = { ...DEFAULTS, ...props };
  const reduced = useReducedMotion();
  const typed = useTypedRoles(p.roles, p.cycleRoles, reduced);
  const count = p.highlights.length;
  const times = scheduleFor(p.highlights);
  const phase = usePhase(times, reduced);
  const done = phase >= count;
  const [summary, setSummary] = useState(false);
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => setSummary(true), times[count]);
    return () => clearTimeout(id);
  }, [times[count], reduced]);

  // Resolve "now" on the client only, so server and client markup match.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(yearNow()), []);
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
    <section className={styles.hero} data-done={done || undefined} data-summary={(summary && !done) || undefined} aria-label="Introduction">
      <div className={styles.glow} aria-hidden="true"><span /><span /><span /></div>

      <div className={styles.stage}>
        <div className={styles.avatar}>
          <span className={styles.ring} aria-hidden="true" />
          <Image src={p.avatarSrc} alt={p.name} width={480} height={480} priority className={styles.photo} />
        </div>

        <p className={styles.eyebrow}>
          <svg className={styles.badge} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.5l2.2 2.3 3.1-.6.6 3.1 2.6 1.8-1.4 2.9 1.4 2.9-2.6 1.8-.6 3.1-3.1-.6L12 21.5l-2.2-2.3-3.1.6-.6-3.1-2.6-1.8L4.9 12 3.5 9.1l2.6-1.8.6-3.1 3.1.6z" />
            <circle cx="12" cy="12" r="2.2" />
          </svg>
          <span className={styles.srOnly}>{p.roles.join(', ')}</span>
          <span className={styles.typed} aria-hidden="true">{typed}<span className={styles.caret}>_</span></span>
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

          <div className={styles.actions} aria-hidden={!done}>
            <a href={p.ctaHref} className={styles.cta} tabIndex={done ? 0 : -1}>{p.ctaLabel}</a>
            <a href={p.availabilityHref} className={`${styles.chip} ${styles.availability}`} tabIndex={done ? 0 : -1}>
              <span className={styles.text}>{p.availability}</span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </a>
          </div>
        </div>

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
                style={{ left: `${a}%`, width: `${b - a}%`, '--i': gi } as CSSProperties}
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
                        style={{ left: `${fa}%`, width: `${fb - fa}%` }}
                      />
                    );
                  })}
                </span>
              </div>
            );
          })}
          {ticks.map((t) => (
            <span key={t.label} className={styles.tick} style={{ left: `${t.at}%` }}><span>{t.label}</span></span>
          ))}
          <span className={`${styles.tick} ${styles.now}`} style={{ left: '100%' }}><span>Now</span></span>
          <span className={styles.marker} data-on={phase >= 0 || undefined} style={{ left: `${markerAt}%` }} />
        </div>
      </div>
    </section>
  );
}
