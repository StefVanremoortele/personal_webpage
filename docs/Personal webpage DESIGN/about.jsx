// About frame — 3 Ostend variants exposed via Tweaks
const { useState, useEffect, useRef, useMemo } = React;

const ACCENT = "oklch(0.86 0.14 172)";
const ACCENT_DIM = "oklch(0.86 0.14 172 / 0.55)";

// ───── helpers
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
function brusselsTime(d) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Brussels",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).format(d);
}
function brusselsHour(d) {
  return Number(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Brussels", hour: "2-digit", hour12: false,
  }).format(d));
}

// ════════════════════════════════════════════ Data readout (trimmed)
function DataVariant() {
  const now = useNow();
  const time = brusselsTime(now);
  const hour = brusselsHour(now);
  const working = hour >= 9 && hour < 18;
  return (
    <div className="ost ost-data">
      <div className="ost-row">
        <span className="k">LOCATION</span>
        <span className="v">Oostende, BE</span>
      </div>
      <div className="ost-row">
        <span className="k">LOCAL</span>
        <span className="v"><span className={`dot ${working ? "live" : "off"}`} /> {time} CET</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════ About frame

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{}/*EDITMODE-END*/;

function About() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <div className="page">
      <div className="about">
        <aside className="col-left">
          <div className="eyebrow">ABOUT</div>
          <DataVariant />
        </aside>

        <div className="col-right">
          <p>
            Most of my experience lies in developing web applications, with a primary
            focus on back-end development and infrastructure. Over time I&apos;ve cultivated
            a real enthusiasm for client-side development and interface design — the
            psychology behind intuitive design, cognitive ease, and user experience as a
            whole.
          </p>
          <p>
            I&apos;m passionate about building products and shipping new features, with a
            strong dedication to design patterns, clean code, and development workflow.
            I think a lot about how to streamline collaboration, documentation, testing,
            building, and deployment.
          </p>
          <p>
            My education in cybersecurity gives me a foundation for designing secure,
            reliable systems. I embed security principles throughout the development
            lifecycle rather than bolting them on at the end.
          </p>
          <ul className="chips">
            {["TypeScript","Node.js","Python","Django","Angular","React / Next.js",
              "gRPC & Microservices","Kafka","PostgreSQL / MS SQL","Azure / Entra",
              "OAuth / OpenID / SAML","Threat modeling (STRIDE)","SIEM (Sentinel/Defender)",
              "NIST / ISO 27001 / NIS2 / GDPR"].map(c => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<About />);
