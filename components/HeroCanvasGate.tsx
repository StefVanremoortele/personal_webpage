"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

type Props = {
  text: string;
  accentColor: string;
  pulseSeq: number;
  onReady?: () => void;
};

export function HeroCanvasGate(props: Props) {
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
      className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]"
    >
      <HeroCanvas {...props} />
    </div>
  );
}

export function useHeroCanvasEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wideEnough = window.matchMedia("(min-width: 768px)").matches;
    setEnabled(motionOk && wideEnough);
  }, []);
  return enabled;
}
