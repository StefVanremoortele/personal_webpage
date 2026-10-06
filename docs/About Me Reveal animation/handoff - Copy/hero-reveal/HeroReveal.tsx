'use client';

import Image from 'next/image';
import { useEffect, useState, type CSSProperties } from 'react';
import styles from './HeroReveal.module.css';

export type Highlight = { label: string; text: string };

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
    { label: 'AI agentic · 2026', text: 'IT solutions architect at SIMIT' },
    { label: 'Security · 2023—26', text: 'Security & compliance engineer at Roularta' },
    { label: 'Development · 2018—23', text: 'Backend engineer at Zora Robotics, NineID' },
  ],
  avatarSrc: '/avatar_me.png',
  ctaLabel: 'Get in contact',
  ctaHref: '#booking',
  availability: 'Open to software & security roles',
  availabilityHref: '#booking',
  cycleRoles: true,
};

// Timeline (seconds) — mirrors the approved motion study.
const HIGHLIGHTS_START = 2.6;
const HIGHLIGHT_SPAN = 1.67;

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

function useTypedRoles(roles: string[], cycle: boolean, reduced: boolean) {
  const [idx, setIdx] = useState(0);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduced) {
      setIdx(0);
      setN(roles[0]?.length ?? 0);
      return;
    }
    let cancelled = false;
    let t: ReturnType<typeof setTimeout>;
    const wait = (ms: number) => new Promise<void>((r) => { t = setTimeout(r, ms); });

    (async () => {
      await wait(900);
      let i = 0;
      while (!cancelled) {
        const word = roles[i] ?? '';
        for (let c = 1; c <= word.length && !cancelled; c++) { setN(c); await wait(55); }
        const last = i === roles.length - 1;
        if (!cycle && last) return;
        await wait(1800);
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
  const ctaDelay = HIGHLIGHTS_START + p.highlights.length * HIGHLIGHT_SPAN;

  return (
    <section className={styles.hero} data-reduced={reduced || undefined} aria-label="Introduction">
      <div className={styles.glow} aria-hidden="true">
        <span /><span /><span />
      </div>

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
          <span className={styles.typed} aria-hidden="true">
            {typed}<span className={styles.caret}>_</span>
          </span>
        </p>

        <h1 className={styles.name}>{p.name}</h1>

        <div className={styles.slot}>
          <ul className={styles.highlights} aria-label="Experience highlights">
            {p.highlights.map((h, i) => (
              <li
                key={h.label + i}
                className={styles.chip}
                style={{ animationDelay: `${HIGHLIGHTS_START + i * HIGHLIGHT_SPAN}s`, animationDuration: `${HIGHLIGHT_SPAN}s` }}
              >
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.label}>{h.label}</span>
                <span className={styles.sep} aria-hidden="true">/</span>
                <span className={styles.text}>{h.text}</span>
              </li>
            ))}
          </ul>

          <div className={styles.actions} style={{ '--cta-delay': `${ctaDelay}s` } as CSSProperties}>
            <a href={p.ctaHref} className={styles.cta}>{p.ctaLabel}</a>
            <a href={p.availabilityHref} className={`${styles.chip} ${styles.availability}`}>
              <span className={styles.text}>{p.availability}</span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
