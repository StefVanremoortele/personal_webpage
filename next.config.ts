import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Dev only: let a phone on the Tailscale network load dev assets (HMR, client JS) from this machine.
  allowedDevOrigins: ["100.82.200.42"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default createMDX({})(nextConfig);
