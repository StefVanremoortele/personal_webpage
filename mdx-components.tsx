import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  p: ({ children }) => (
    <p className="text-[15px] leading-relaxed text-foreground/80">{children}</p>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
