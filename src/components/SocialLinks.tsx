import { Mail, Phone, Globe } from "lucide-react";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "./icons/BrandIcons";
import type { SocialLinks as SocialLinksType } from "../types/portfolio";

interface Props {
  social: SocialLinksType;
  variant?: "pill" | "plain";
}

export default function SocialLinks({ social, variant = "pill" }: Props) {
  const items = [
    { key: "github", href: social.github, icon: GithubIcon, label: "GitHub" },
    { key: "instagram", href: social.instagram, icon: InstagramIcon, label: "Instagram" },
    { key: "linkedin", href: social.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
    {
      key: "email",
      href: social.email ? `mailto:${social.email}` : "",
      icon: Mail,
      label: "Email",
    },
    {
      key: "phone",
      href: social.phone ? `tel:${social.phone.replace(/\s+/g, "")}` : "",
      icon: Phone,
      label: "Phone",
    },
    { key: "website", href: social.website, icon: Globe, label: "Website" },
  ].filter((item) => item.href);

  if (items.length === 0) return null;

  const isExternal = (href: string) => href.startsWith("http");

  const wrapperClass =
    variant === "pill"
      ? "flex items-center gap-2 rounded-full border border-line bg-card px-3 py-2"
      : "flex items-center gap-4";

  const itemClass =
    variant === "pill"
      ? "flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors hover:opacity-70 hover:bg-black/5"
      : "text-black transition-colors hover:opacity-70";

  return (
    <div className={wrapperClass}>
      {items.map(({ key, href, icon: Icon, label }) => (
        <a
          key={key}
          href={href}
          target={isExternal(href) ? "_blank" : undefined}
          rel={isExternal(href) ? "noopener noreferrer" : undefined}
          aria-label={label}
          className={itemClass}
        >
          <Icon size={18} strokeWidth={1.75} />
        </a>
      ))}
    </div>
  );
}
