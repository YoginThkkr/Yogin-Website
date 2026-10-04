export interface SocialLinks {
  github: string;
  instagram: string;
  linkedin: string;
  email: string;
  phone: string;
  website: string;
}

export type AvatarView =
  | "front"
  | "threeQuarter" // turned towards the right of the screen
  | "threeQuarterLeft" // turned towards the left of the screen
  | "side"
  | "back"
  | "lookUp"
  | "lookUpLeft"
  | "lookUpRight";

export interface AvatarAngles {
  front: string;
  threeQuarter?: string;
  side?: string;
  back?: string;
  /** Extra poses used by the intro, where the head follows the cursor */
  threeQuarterLeft?: string;
  lookUp?: string;
  lookUpLeft?: string;
  lookUpRight?: string;
}

export interface Profile {
  name: string;
  shortName: string;
  tagline: string;
  role: string;
  specialization: string;
  location: string;
  yearsOfExperience: number;
  bio: string;
  avatarSvg: string;
  /**
   * Optional character images in /public, by file name without extension.
   * Each needs a .webp and a .png. Replaces the SVG monogram when set.
   */
  avatar?: AvatarAngles;
  /** Optional second character used in the résumé (falls back to `avatar`) */
  avatarResume?: AvatarAngles;
  /** Optional CV file in /public, offered as a download */
  cv?: string;
  social: SocialLinks;
}

export interface SkillCategory {
  name: string;
  items: string[];
}

export interface Skills {
  categories: SkillCategory[];
}

export interface Sticker {
  /** Short text printed on the sticker, e.g. "NIFT" */
  label: string;
  shape: "pill" | "circle" | "square" | "tag";
  /** Sticker fill colour; text on it is always black */
  color: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  /** Three short lines shown in the scrolling résumé */
  points?: string[];
  sticker?: Sticker;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  role: string;
  year: string;
  link: string;
  image: string;
  highlight: boolean;
}

export interface Education {
  institution: string;
  credential: string;
  period: string;
  note: string;
  sticker?: Sticker;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarColor: string;
}

export interface Credential {
  label: string;
  /** Full name, shown next to the sticker */
  title: string;
  sticker: Sticker;
}

export interface Portfolio {
  profile: Profile;
  credentials?: Credential[];
  skills: Skills;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  testimonials: Testimonial[];
}
