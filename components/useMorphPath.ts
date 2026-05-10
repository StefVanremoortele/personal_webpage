"use client";

import { useEffect, useRef } from "react";
// @ts-expect-error — flubber ships no types
import { interpolate } from "flubber";

type Interp = (t: number) => string;

/**
 * Returns a ref for an SVG <path>. When `key` changes, animates the path's
 * `d` attribute from the previous shape to `paths[key]` using flubber over
 * `dur` ms with a smooth in/out easing.
 */
export function useMorphPath<K extends string>(
  paths: Record<K, string>,
  key: K,
  dur = 600,
) {
  const ref = useRef<SVGPathElement | null>(null);
  const prevKey = useRef<K>(key);

  useEffect(() => {
    if (prevKey.current === key || !ref.current) return;
    let interp: Interp;
    try {
      interp = interpolate(paths[prevKey.current], paths[key], {
        maxSegmentLength: 3,
      }) as Interp;
    } catch {
      ref.current.setAttribute("d", paths[key]);
      prevKey.current = key;
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const node = ref.current;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 0.5 - 0.5 * Math.cos(Math.PI * p);
      node.setAttribute("d", interp(e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prevKey.current = key;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key, paths, dur]);

  return ref;
}
