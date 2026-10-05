"use client";

import { profile } from "@/content/site";

const WHATSAPP_MESSAGE =
  "Hi Stef, I found your portfolio and would like to discuss a possible collaboration.";

type IconProps = {
  className?: string;
};

type ContactOption = {
  eyebrow: string;
  title: string;
  body: string;
  action: string;
  href: string;
  external: boolean;
  Icon: (props: IconProps) => React.ReactNode;
};

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.02 3.2C8.98 3.2 3.28 8.9 3.28 15.93c0 2.23.59 4.42 1.71 6.35L3.17 29l6.88-1.8a12.67 12.67 0 0 0 5.96 1.51h.01c7.03 0 12.74-5.7 12.74-12.73 0-3.4-1.33-6.6-3.73-9.01A12.66 12.66 0 0 0 16.02 3.2Zm.01 23.2h-.01c-1.9 0-3.76-.51-5.39-1.48l-.39-.23-4.08 1.07 1.09-3.98-.26-.41a10.38 10.38 0 0 1-1.6-5.44c0-5.86 4.77-10.62 10.64-10.62 2.84 0 5.5 1.1 7.51 3.11a10.55 10.55 0 0 1 3.11 7.52c0 5.86-4.76 10.62-10.62 10.62Zm5.83-7.96c-.32-.16-1.9-.94-2.2-1.04-.29-.11-.51-.16-.72.16-.21.31-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.84-1.59-1.89-1.78-2.21-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.99-2.36-.26-.62-.52-.53-.72-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.68s1.15 3.1 1.31 3.31c.16.21 2.27 3.46 5.49 4.85.77.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.54-.08-.13-.29-.21-.61-.37Z"
      />
    </svg>
  );
}

function EmailIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

export function Booking() {
  const contactOptions: ContactOption[] = [
    {
      eyebrow: "Fastest",
      title: "WhatsApp",
      body: "Direct chat. Quick response. Preferred method.",
      action: "Message me",
      href: `${profile.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
      external: true,
      Icon: WhatsAppIcon,
    },
    {
      eyebrow: "Async",
      title: "Email",
      body: "Response guaranteed. Can take up to 48h.",
      action: "Send email",
      href: `mailto:${profile.email}`,
      external: false,
      Icon: EmailIcon,
    },
  ];

  return (
    <section
      id="booking"
      className="snap-section flex justify-center px-4 py-16 sm:px-8 sm:py-24"
      style={{
        // Soft lavender/magenta glow, echoing the hero's ambient light.
        background:
          "radial-gradient(ellipse 55% 45% at 50% 32%, rgba(232,121,249,0.09), transparent 70%), radial-gradient(ellipse 45% 40% at 28% 72%, rgba(165,180,252,0.07), transparent 70%)",
      }}
    >
      <div className="w-full max-w-[1080px]">
        <header className="mx-auto mb-10 max-w-[720px] text-center sm:mb-12">
          <h2 className="mb-5 text-[34px] font-extrabold leading-none tracking-[-0.03em] sm:text-6xl md:text-[72px]">
            Let&apos;s work{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--accent-text)" }}>
              together.
            </span>
          </h2>
          <p className="m-0 text-base leading-[1.6] text-[var(--muted)] sm:text-[18px]">
            Freelance project work and architecture engagements are especially welcome.
            Reach out to discuss a practical way to work together.
          </p>
        </header>

        <div className="mx-auto grid max-w-[720px] gap-3 sm:grid-cols-2">
          {contactOptions.map((option) => (
            <a
              key={option.title}
              href={option.href}
              target={option.external ? "_blank" : undefined}
              rel={option.external ? "noopener noreferrer" : undefined}
              className="group flex min-h-[172px] flex-col rounded-[18px] border border-[var(--line)] p-4 text-[var(--fg)] no-underline transition duration-300 hover:-translate-y-1 hover:border-[color:var(--accent-border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] sm:p-5"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.006))",
              }}
            >
              <span
                className="self-start bg-clip-text font-mono text-[10px] font-semibold uppercase tracking-[0.26em] text-transparent"
                style={{ backgroundImage: "var(--accent-text)" }}
              >
                {option.eyebrow}
              </span>
              <div className="mt-8 flex items-stretch gap-4">
                <span
                  className="flex min-h-16 w-16 shrink-0 items-center justify-center rounded-[16px] text-[var(--accent-contrast)] shadow-[0_0_46px_-12px_var(--glow)] ring-1 ring-white/20 transition duration-300 group-hover:scale-[1.04]"
                  style={{ backgroundImage: "var(--accent-fill)" }}
                >
                  <option.Icon className="h-8 w-8" />
                </span>
                <div className="min-w-0">
                  <h3 className="mb-2 text-xl font-bold tracking-[-0.02em] sm:text-[22px]">
                    {option.title}
                  </h3>
                  <p className="m-0 text-[14px] leading-[1.55] text-[var(--muted)]">
                    {option.body}
                  </p>
                </div>
              </div>
              <span className="mt-auto inline-flex pt-6 text-[14px] font-semibold text-[var(--fg)] transition group-hover:text-[var(--accent)]">
                {option.action} →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
