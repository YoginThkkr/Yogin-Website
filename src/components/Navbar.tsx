import { useEffect, useState } from "react";
import { usePortfolio } from "../hooks/usePortfolio";

const LINKS = [
  { label: "Résumé", href: "#resume" },
  { label: "Projects", href: "#works" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { profile } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-nav ${scrolled ? "site-nav--scrolled" : ""}`}>
      <a href="#top" className="site-nav-brand">
        <span className="site-nav-name">{profile.name}</span>
        <span className="site-nav-role">{profile.role}</span>
      </a>
      <nav aria-label="Main">
        <ul className="site-nav-links">
          {LINKS.map((link) => (
            <li key={link.href} className={link.href === "#contact" ? "" : "hide-on-phone"}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
