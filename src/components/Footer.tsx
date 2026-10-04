import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { usePortfolio } from "../hooks/usePortfolio";
import SocialLinks from "./SocialLinks";

const NAV_LINKS = [
  { label: "About", href: "#top" },
  { label: "Résumé", href: "#resume" },
  { label: "Projects", href: "#works" },
  { label: "Skills", href: "#skills" },
];

export default function Footer() {
  const { profile } = usePortfolio();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!profile.social.email) return;
    try {
      await navigator.clipboard.writeText(profile.social.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable; fail silently.
    }
  };

  return (
    <footer id="contact" className="border-t border-line px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 sm:grid-cols-3">
          <div>
            <p className="font-display text-4xl text-black">{profile.name}</p>
            <p className="mt-2 text-sm text-black">{profile.specialization}</p>
            <p className="mt-1 text-sm text-black">{profile.location}</p>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-black">
              Navigate
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-black transition-colors hover:opacity-70"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-black">
              Reach Out
            </h3>

            {profile.social.email && (
              <button
                type="button"
                onClick={handleCopy}
                className="mb-3 flex items-center gap-2 text-sm text-black transition-colors hover:opacity-70"
              >
                {profile.social.email}
                {copied ? (
                  <Check size={14} className="text-black" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            )}

            {profile.social.phone && (
              <p className="mb-5 text-sm text-black">{profile.social.phone}</p>
            )}

            <SocialLinks social={profile.social} variant="plain" />

            {profile.cv && (
              <a
                href={`${import.meta.env.BASE_URL}${profile.cv}`}
                download
                className="mt-5 inline-block text-sm text-black underline underline-offset-4 hover:opacity-70"
              >
                Download CV (password protected)
              </a>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-xs text-black sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p>Built with React, TypeScript &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
