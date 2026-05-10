// Booking — availability strip + slot picker
const { useState, useEffect, useMemo, useRef } = React;

const ACCENT = "oklch(0.86 0.14 172)";
const TZ = "Europe/Brussels";

// Generate next 14 days starting today (Brussels time).
function buildDays(now) {
  const days = [];
  // Use Brussels-local date as the base.
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  const todayParts = fmt.format(now); // "YYYY-MM-DD"
  const [y, m, d] = todayParts.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d));
  for (let i = 0; i < 14; i++) {
    const dt = new Date(start.getTime() + i * 86400000);
    const dow = dt.getUTCDay(); // 0..6 (Sun..Sat) approx
    days.push({
      date: dt,
      dayNum: dt.getUTCDate(),
      dow: ["SUN","MON","TUE","WED","THU","FRI","SAT"][dow],
      isWeekend: dow === 0 || dow === 6,
      isToday: i === 0,
      monthShort: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][dt.getUTCMonth()],
    });
  }
  return days;
}

// Pseudo-random but stable slot list per day. Uses date as seed.
function slotsForDay(day) {
  if (day.isWeekend) return [];
  const seed = day.date.getUTCFullYear() * 10000 + (day.date.getUTCMonth() + 1) * 100 + day.dayNum;
  const all = ["09:00","09:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];
  const out = [];
  for (let i = 0; i < all.length; i++) {
    // simple hash to decide availability
    const v = ((seed * (i + 7)) ^ (seed >> 3)) % 7;
    if (v < 3) out.push(all[i]);
  }
  return out;
}

function Booking() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(id); }, []);

  const days = useMemo(() => buildDays(now), [now]);
  const [activeDayIdx, setActiveDayIdx] = useState(() => {
    // first weekday with slots
    const tmp = buildDays(now);
    return tmp.findIndex(d => !d.isWeekend) || 0;
  });
  const [selected, setSelected] = useState(null);
  const stripRef = useRef(null);

  const activeDay = days[activeDayIdx];
  const slots = useMemo(() => slotsForDay(activeDay), [activeDay]);

  const totalThisWeek = useMemo(() => {
    return days.slice(0, 7).reduce((sum, d) => sum + slotsForDay(d).length, 0);
  }, [days]);

  function handleConfirm() {
    if (!selected) return;
    // would deep-link into Cal.com / Calendly here
    alert(`Booking ${activeDay.dow} ${activeDay.dayNum} ${activeDay.monthShort} at ${selected} CET`);
  }

  return (
    <div className="page">
      <div className="book">
        <header className="book-head">
          <h1 className="title">Let&apos;s work together.</h1>
          <p className="lede">
            Open to senior software &amp; security roles, freelance engagements, and architecture work.
            Easiest way to reach me is to grab 15 minutes on my calendar.
          </p>
        </header>

        <section className="cal" style={{ "--accent": ACCENT }}>
          <div className="cal-meta">
            <span className="meta-pill"><span className="dot" /> {totalThisWeek} slots open this week</span>
            <span className="meta-tz">All times CET · Brussels</span>
          </div>

          <div className="day-strip" ref={stripRef}>
            {days.map((d, i) => {
              const has = slotsForDay(d).length > 0;
              const isActive = i === activeDayIdx;
              return (
                <button
                  key={i}
                  type="button"
                  className={`day ${isActive ? "active" : ""} ${!has ? "empty" : ""}`}
                  disabled={!has}
                  onClick={() => { setActiveDayIdx(i); setSelected(null); }}
                >
                  <span className="dow">{d.dow}</span>
                  <span className="dn">{d.dayNum}</span>
                  <span className="mo">{d.monthShort}</span>
                  {d.isToday && <span className="today-tag">TODAY</span>}
                  <span className="day-pip" data-on={has ? "1" : "0"} />
                </button>
              );
            })}
          </div>

          <div className="cal-body">
            <div className="cal-body-head">
              <div className="active-day">
                {activeDay.dow}, {activeDay.monthShort} {activeDay.dayNum}
              </div>
              <div className="duration"><span className="dot" /> 15 min</div>
            </div>

            {slots.length > 0 ? (
              <div className="slots">
                {slots.map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`slot ${selected === s ? "selected" : ""}`}
                    onClick={() => setSelected(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">No availability — pick another day.</div>
            )}

            <div className="cal-foot">
              <button
                type="button"
                className={`confirm ${selected ? "ready" : ""}`}
                disabled={!selected}
                onClick={handleConfirm}
              >
                {selected
                  ? `Confirm — ${activeDay.dow} ${activeDay.dayNum} ${activeDay.monthShort} · ${selected}`
                  : "Pick a time"}
              </button>
              <a className="alt" href="#">Or send an email →</a>
            </div>
          </div>
        </section>

        <footer className="contact-row">
          <a href="#">GitHub</a>
          <a href="#">LinkedIn</a>
          <a href="#">Email</a>
        </footer>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Booking />);
