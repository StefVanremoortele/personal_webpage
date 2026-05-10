// Hero with rotating role + morphing icon
const { useState, useEffect, useRef, useMemo } = React;

const ROLES = [
  {
    key: "dev",
    label: "Software Developer",
    color: "oklch(0.86 0.14 172)",   // mint (existing brand)
    glow: "oklch(0.86 0.14 172 / 0.45)",
    gradient: "linear-gradient(135deg, oklch(0.86 0.14 172), oklch(0.86 0.14 172))",
  },
  {
    key: "sec",
    label: "Security Specialist",
    color: "oklch(0.84 0.13 78)",    // amber / vigilance
    glow: "oklch(0.84 0.13 78 / 0.45)",
    gradient: "linear-gradient(135deg, oklch(0.84 0.13 78), oklch(0.84 0.13 78))",
  },
  {
    key: "agent",
    label: "Agentic Orchestrator",
    color: "oklch(0.78 0.16 305)",   // violet / AI (mid-stop, used for icon stroke)
    glow: "oklch(0.74 0.20 325 / 0.55)",
    // rich purple → magenta gradient for AI
    gradient: "linear-gradient(120deg, oklch(0.82 0.17 282) 0%, oklch(0.72 0.22 318) 55%, oklch(0.78 0.18 350) 100%)",
  },
];

// ───────────────────────────────────────────────────────── Icon variants

// Single closed paths per role — same topology family so flubber morphs cleanly.
// dev: terminal window  •  sec: shield  •  agent: 4-lobed hub
const MORPH_OUTER = [
  "M12 10 L36 10 Q40 10 40 14 L40 34 Q40 38 36 38 L12 38 Q8 38 8 34 L8 14 Q8 10 12 10 Z",
  "M24 6 L40 12 L40 24 C40 32 33 40 24 42 C15 40 8 32 8 24 L8 12 Z",
  "M24 6 C26 12 26 12 30 12 C34 10 34 10 36 14 C36 18 36 18 40 20 C42 24 42 24 40 28 C36 30 36 30 36 34 C34 38 34 38 30 36 C26 36 26 36 24 42 C22 36 22 36 18 36 C14 38 14 38 12 34 C12 30 12 30 8 28 C6 24 6 24 8 20 C12 18 12 18 12 14 C14 10 14 10 18 12 C22 12 22 12 24 6 Z",
];

function useMorphPath(paths, idx, dur = 650) {
  const ref = useRef(null);
  const prevIdx = useRef(idx);
  useEffect(() => {
    if (prevIdx.current === idx || !ref.current) return;
    const flub = window.flubber;
    if (!flub) {
      ref.current.setAttribute("d", paths[idx]);
      prevIdx.current = idx;
      return;
    }
    let interp;
    try {
      interp = flub.interpolate(paths[prevIdx.current], paths[idx], { maxSegmentLength: 3 });
    } catch (e) {
      ref.current.setAttribute("d", paths[idx]);
      prevIdx.current = idx;
      return;
    }
    let raf, start = null;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 0.5 - 0.5 * Math.cos(Math.PI * p); // smooth in/out
      if (ref.current) ref.current.setAttribute("d", interp(e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prevIdx.current = idx;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idx, paths, dur]);
  return ref;
}

// A. Line — morphing outline + crossfading inner detail
function IconLine({ idx }) {
  const pathRef = useMorphPath(MORPH_OUTER, idx);
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path ref={pathRef} d={MORPH_OUTER[idx]} />
      {/* inner accents crossfade */}
      <g style={{ opacity: idx === 0 ? 1 : 0, transition: "opacity 420ms ease" }}>
        <path d="M19 20 L14 24 L19 28" />
        <path d="M29 20 L34 24 L29 28" />
      </g>
      <g style={{ opacity: idx === 1 ? 1 : 0, transition: "opacity 420ms ease" }}>
        <circle cx="24" cy="22" r="2.4" />
        <path d="M24 25 V30" />
      </g>
      <g style={{ opacity: idx === 2 ? 1 : 0, transition: "opacity 420ms ease" }}>
        <circle cx="24" cy="24" r="3" />
      </g>
    </svg>
  );
}

// B. Filled — morphing outer silhouette (translucent) + morphing inner mark.
const MORPH_INNER = [
  // dev: brackets-as-diamond
  "M24 16 L18 24 L24 32 L26 30 L22 24 L26 18 Z M24 16 L30 24 L24 32 L22 30 L26 24 L22 18 Z",
  // sec: inner shield
  "M24 14 L34 18 L34 25 C34 30 29.5 34.5 24 36 C18.5 34.5 14 30 14 25 L14 18 Z",
  // agent: inner hub
  "M24 18 C26 18 28 20 28 22 C28 22 28 26 28 26 C28 28 26 30 24 30 C22 30 20 28 20 26 C20 26 20 22 20 22 C20 20 22 18 24 18 Z",
];
function IconFilled({ idx }) {
  const outerRef = useMorphPath(MORPH_OUTER, idx);
  const innerRef = useMorphPath(MORPH_INNER, idx);
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" fill="currentColor">
      <path ref={outerRef} d={MORPH_OUTER[idx]} opacity="0.18" />
      <path ref={innerRef} d={MORPH_INNER[idx]} fillRule="evenodd" />
    </svg>
  );
}

// C. Animated scenes (per-role micro-motion)
function IconScene({ idx, tick }) {
  // tick increments each cycle so we can re-trigger CSS animations
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* dev: terminal with blinking cursor + typed line */}
      <g style={{ opacity: idx === 0 ? 1 : 0, transition: "opacity 380ms ease" }}>
        <rect x="6" y="10" width="36" height="28" rx="3" />
        <path d="M6 16 L42 16" opacity="0.5" />
        <circle cx="10" cy="13" r="0.9" fill="currentColor" stroke="none" opacity="0.7" />
        <circle cx="13" cy="13" r="0.9" fill="currentColor" stroke="none" opacity="0.7" />
        <circle cx="16" cy="13" r="0.9" fill="currentColor" stroke="none" opacity="0.7" />
        <path d="M11 23 L15 26 L11 29" />
        {idx === 0 && (
          <line key={`type-${tick}`} x1="18" y1="29" x2="18" y2="29"
                strokeWidth="2.4" strokeLinecap="round">
            <animate attributeName="x2" from="18" to="32" dur="1.4s" begin="0.2s" fill="freeze" />
          </line>
        )}
        {idx === 0 && (
          <rect x="32" y="33" width="2.4" height="2" fill="currentColor" stroke="none">
            <animate attributeName="opacity" values="1;1;0;0" dur="0.8s" repeatCount="indefinite" />
          </rect>
        )}
      </g>
      {/* sec: shield with checkmark drawing in */}
      <g style={{ opacity: idx === 1 ? 1 : 0, transition: "opacity 380ms ease" }}>
        <path d="M24 6 L40 12 V24 C40 32 33 40 24 42 C15 40 8 32 8 24 V12 Z" />
        {idx === 1 && (
          <path key={`check-${tick}`} d="M16 24 L22 30 L33 18" pathLength="1"
                strokeDasharray="1" strokeDashoffset="1">
            <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.7s"
                     begin="0.15s" fill="freeze" />
          </path>
        )}
      </g>
      {/* agent: hub with pulsing nodes + drawn connections */}
      <g style={{ opacity: idx === 2 ? 1 : 0, transition: "opacity 380ms ease" }}>
        <circle cx="24" cy="24" r="4" />
        {[
          { cx: 10, cy: 14, lx: 12, ly: 16, ex: 21, ey: 22 },
          { cx: 38, cy: 14, lx: 36, ly: 16, ex: 27, ey: 22 },
          { cx: 10, cy: 34, lx: 12, ly: 32, ex: 21, ey: 26 },
          { cx: 38, cy: 34, lx: 36, ly: 32, ex: 27, ey: 26 },
        ].map((n, i) => (
          <g key={i}>
            {idx === 2 && (
              <line key={`ln-${tick}-${i}`} x1={n.lx} y1={n.ly} x2={n.lx} y2={n.ly}
                    opacity="0.55" strokeWidth="1.6">
                <animate attributeName="x2" from={n.lx} to={n.ex} dur="0.55s"
                         begin={`${0.1 + i * 0.07}s`} fill="freeze" />
                <animate attributeName="y2" from={n.ly} to={n.ey} dur="0.55s"
                         begin={`${0.1 + i * 0.07}s`} fill="freeze" />
              </line>
            )}
            <circle cx={n.cx} cy={n.cy} r="2.5">
              {idx === 2 && (
                <animate attributeName="r" values="2.5;3.4;2.5" dur="1.6s"
                         begin={`${0.4 + i * 0.12}s`} repeatCount="indefinite" />
              )}
            </circle>
          </g>
        ))}
      </g>
    </svg>
  );
}

function Icon({ variant, idx, tick }) {
  if (variant === "none") return null;
  if (variant === "filled") return <IconFilled idx={idx} />;
  if (variant === "scene") return <IconScene idx={idx} tick={tick} />;
  return <IconLine idx={idx} />;
}

// ───────────────────────────────────────────────────────── Rotating eyebrow

function RotatingRole({ idx, color }) {
  return (
    <div className="role-stack" style={{ color }}>
      {ROLES.map((r, i) => (
        <span key={r.key} className={`role-word ${i === idx ? "is-active" : ""}`}>
          {r.label}
        </span>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────── Main hero

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "iconStyle": "line",
  "shiftColor": true,
  "rotateMs": 2600
}/*EDITMODE-END*/;

function Hero() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [idx, setIdx] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx(p => (p + 1) % ROLES.length);
      setTick(p => p + 1);
    }, t.rotateMs);
    return () => clearInterval(id);
  }, [t.rotateMs]);

  const role = ROLES[idx];
  const accent = t.shiftColor ? role.color : ROLES[0].color;
  const glow = t.shiftColor ? role.glow : ROLES[0].glow;
  const gradient = t.shiftColor ? role.gradient : ROLES[0].gradient;

  return (
    <div
      className="hero"
      style={{ "--accent": accent, "--glow": glow, "--accent-gradient": gradient }}
    >
      <div className="hero-inner">
        <div className="eyebrow">
          <span className="eyebrow-icon" style={{ color: accent }}>
            <Icon variant={t.iconStyle} idx={idx} tick={tick} />
          </span>
          <RotatingRole idx={idx} color={accent} />
        </div>

        <h1 className="title">Stef Vanremoortele.</h1>

        <p className="lede">
          Software developer &amp; security specialist building secure,
          well-crafted<br />
          web platforms — backend-first, with a soft spot for clean UX.
        </p>

        <div className="cta-row">
          <a className="btn btn-primary" href="#">Book a 15-min call</a>
          <a className="btn btn-ghost" href="#">See experience</a>
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Hero">
          <TweakRadio
            label="Icon style"
            value={t.iconStyle}
            onChange={v => setTweak("iconStyle", v)}
            options={[
              { value: "line", label: "Line" },
              { value: "filled", label: "Filled" },
              { value: "scene", label: "Scene" },
              { value: "none", label: "None" },
            ]}
          />
          <TweakToggle
            label="Distinct color per role"
            value={t.shiftColor}
            onChange={v => setTweak("shiftColor", v)}
          />
          <TweakSlider
            label="Rotation (ms)"
            min={1500}
            max={5000}
            step={100}
            value={t.rotateMs}
            onChange={v => setTweak("rotateMs", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Hero />);
