"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { label: "Privacy Policy",   href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Help Center",      href: "/help-center" },
  { label: "Contact Us",       href: "/contact-us" },
];

export default function LandingFooter({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <footer
      className={[
        "w-full px-4 md:px-6 bg-surface border-t border-white/40 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto z-10 relative",
        compact ? "py-4 gap-3" : "py-8 md:py-12 gap-4 md:gap-5",
      ].join(" ")}
    >
      <Link href="/">
        <Image
          src="/logo.png"
          alt="PetalBird"
          width={compact ? 44 : 64}
          height={compact ? 44 : 64}
          className="object-contain"
        />
      </Link>

      <ul className={compact ? "flex flex-wrap justify-center gap-x-4 gap-y-2" : "flex flex-wrap justify-center gap-x-5 gap-y-3 md:gap-6"}>
        {links.map(({ label, href }) => {
          const active = pathname === href;
          return (
            <li key={label}>
              <Link
                href={href}
                className={[
                  compact ? "text-xs leading-4" : "text-sm leading-5",
                  "transition-colors relative",
                  active
                    ? "text-primary font-semibold after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#7B7FEF] after:to-[#A78BFA]"
                    : "text-on-surface-variant hover:text-primary",
                ].join(" ")}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <p className={[compact ? "text-xs leading-4" : "text-sm leading-5", "text-on-surface text-center md:text-right"].join(" ")}>
        © 2026 PetalBird. Premium Social Discovery.
      </p>
    </footer>
  );
}
