"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export function HeroCanvasGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wideEnough = window.matchMedia("(min-width: 768px)").matches;
    setEnabled(motionOk && wideEnough);
  }, []);

  if (!enabled) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-auto absolute inset-0 -z-10 opacity-80 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"
    >
      <HeroCanvas />
    </div>
  );
}
