// Experience timeline with era-coded entries (DEV → SEC → AGENT).
// Older entries marked [placeholder] — replace with real history.
const { useState, useEffect, useRef } = React;

const ERAS = {
  dev:   { key: "dev",   label: "DEV",      color: "oklch(0.86 0.14 172)" },
  sec:   { key: "sec",   label: "SECURITY", color: "oklch(0.84 0.13 78)" },
  agent: { key: "agent", label: "AI",       color: "oklch(0.78 0.16 305)",
           gradient: "linear-gradient(120deg, oklch(0.82 0.17 282), oklch(0.72 0.22 318), oklch(0.78 0.18 350))" },
};

// Newest first (top of timeline = current).
const ENTRIES = [
  {
    era: "agent",
    title: "IT Solutions Architect",
    company: "SIMIT",
    period: "Jan 2026 — Mar 2026",
    body: [
      "Provided high-level technical support and architectural oversight for active software projects — system stability, performance, alignment with business requirements.",
      "Spearheaded the integration of AI-driven coding tools and LLM workflows into the development lifecycle to accelerate delivery and modernize the engineering environment.",
    ],
    reference: { name: "Jeffrey Drooghenbroodt", role: "CEO" },
  },
  {
    era: "sec",
    title: "IT Security & Compliance Engineer",
    company: "Roularta Media Group",
    period: "Jul 2023 — Jan 2026",
    body: [
      "Improved security posture for a large media & advertising company, including an OT environment for magazine printing.",
      "Led application security and user-awareness campaigns; conditional access, IAM, and adherence to NIST / GDPR / NIS2 / ISO 27001/27005/27003.",
      "Restructured a legacy on-prem AD domain (insecure protocols, certificates, patching) and integrated it with Azure / Entra using OAuth, OpenID, SAML.",
      "Threat detection (STRIDE, threat modeling, code analysis, pentesting), risk assessment (CVSS / EPSS), and vulnerability management.",
    ],
  },
  {
    era: "dev",
    title: "Senior Software Developer",
    company: "[Placeholder — replace]",
    period: "20XX — 2023",
    body: [
      "Backend-leaning full-stack work on web platforms; gRPC microservices, Kafka, PostgreSQL.",
      "Mentored juniors, owned architecture decisions, drove CI/CD modernization.",
    ],
  },
  {
    era: "dev",
    title: "Software Developer",
    company: "[Placeholder — replace]",
    period: "20XX — 20XX",
    body: [
      "Built and shipped product features across the stack. Django + Angular / React.",
    ],
  },
  {
    era: "dev",
    title: "Junior Developer",
    company: "[Placeholder — first role]",
    period: "20XX",
    body: [
      "First job out of school. Learned the trade — production code, code review, Git workflow, deploys.",
    ],
  },
];

// Single-path morph glyphs (same family as hero icons)
const GLYPH_PATHS = {
  dev:   "M12 10 L36 10 Q40 10 40 14 L40 34 Q40 38 36 38 L12 38 Q8 38 8 34 L8 14 Q8 10 12 10 Z",
  sec:   "M24 6 L40 12 L40 24 C40 32 33 40 24 42 C15 40 8 32 8 24 L8 12 Z",
  agent: "M24 6 C26 12 26 12 30 12 C34 10 34 10 36 14 C36 18 36 18 40 20 C42 24 42 24 40 28 C36 30 36 30 36 34 C34 38 34 38 30 36 C26 36 26 36 24 42 C22 36 22 36 18 36 C14 38 14 38 12 34 C12 30 12 30 8 28 C6 24 6 24 8 20 C12 18 12 18 12 14 C14 10 14 10 18 12 C22 12 22 12 24 6 Z",
};

function useMorphPath(eraKey, dur = 600) {
  const ref = useRef(null);
  const prevKey = useRef(eraKey);
  useEffect(() => {
    if (prevKey.current === eraKey || !ref.current) return;
    const flub = window.flubber;
    if (!flub) {
      ref.current.setAttribute("d", GLYPH_PATHS[eraKey]);
      prevKey.current = eraKey;
      return;
    }
    let interp;
    try { interp = flub.interpolate(GLYPH_PATHS[prevKey.current], GLYPH_PATHS[eraKey], { maxSegmentLength: 3 }); }
    catch { ref.current.setAttribute("d", GLYPH_PATHS[eraKey]); prevKey.current = eraKey; return; }
    let raf, start = null;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 0.5 - 0.5 * Math.cos(Math.PI * p);
      if (ref.current) ref.current.setAttribute("d", interp(e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prevKey.current = eraKey;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [eraKey, dur]);
  return ref;
}

// Sticky era indicator — tracks which entry is in viewport center.
function EraIndicator({ activeEra }) {
  const era = ERAS[activeEra];
  const ref = useMorphPath(activeEra);
  const accentBg = era.gradient || era.color;
  return (
    <div className="era-stick" style={{ "--accent": era.color }}>
      <div className="era-glyph">
        <svg viewBox="0 0 48 48" width="56" height="56" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path ref={ref} d={GLYPH_PATHS[activeEra]} />
        </svg>
      </div>
      <div className="era-label" style={{ backgroundImage: accentBg.startsWith("linear") ? accentBg : `linear-gradient(0deg, ${accentBg}, ${accentBg})` }}>
        {era.label}
      </div>
      <div className="era-progress">
        {Object.keys(ERAS).map(k => (
          <span key={k} className={`pip ${k === activeEra ? "on" : ""}`}
                style={{ background: k === activeEra ? ERAS[k].color : "rgba(255,255,255,0.15)" }} />
        ))}
      </div>
    </div>
  );
}

function Entry({ entry, idx, onIntersect }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) onIntersect(idx); }); },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [idx, onIntersect]);

  const era = ERAS[entry.era];
  const dotBg = era.gradient || era.color;

  return (
    <article ref={ref} className="entry" style={{ "--accent": era.color }}>
      <div className="dot-wrap">
        <span className="dot-outer" />
        <span className="dot" style={{ background: dotBg }} />
      </div>
      <div className="entry-body">
        <header className="entry-head">
          <h3 className="entry-title">
            {entry.title} <span className="at">@ {entry.company}</span>
          </h3>
          <span className="entry-period">{entry.period}</span>
        </header>
        <div className="entry-era" style={{ color: era.color }}>{era.label}</div>
        {entry.body.map((p, i) => <p key={i}>{p}</p>)}
        {entry.reference && (
          <p className="ref">
            <span style={{ color: era.color, fontWeight: 600 }}>Reference:</span>{" "}
            <span className="ref-name">{entry.reference.name} ({entry.reference.role})</span>
          </p>
        )}
      </div>
    </article>
  );
}

function Experience() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeEra = ENTRIES[activeIdx].era;

  return (
    <div className="page">
      <div className="exp">
        <aside className="exp-aside">
          <div className="eyebrow">EXPERIENCE</div>
          <EraIndicator activeEra={activeEra} />
        </aside>

        <div className="exp-timeline">
          <div className="rail" />
          {ENTRIES.map((entry, i) => (
            <Entry key={i} entry={entry} idx={i} onIntersect={setActiveIdx} />
          ))}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Experience />);
