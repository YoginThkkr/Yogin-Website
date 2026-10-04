import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Lock } from "lucide-react";
import { usePortfolio } from "../hooks/usePortfolio";
import { useReducedMotion } from "../hooks/useMediaQuery";
import { CURSOR_POSES, useCursorPose } from "../hooks/useCursorPose";
import Medallion from "./Medallion";
import Sticker from "./Sticker";

export default function IntroSection() {
  const { profile, credentials = [] } = usePortfolio();
  const base = import.meta.env.BASE_URL;
  const avatarRef = useRef<HTMLDivElement>(null);

  // Follows the mouse on computers and the finger on phones, if motion is welcome.
  const reduced = useReducedMotion();
  const follow = !reduced && Boolean(profile.avatar);
  const { pose, leanX, leanY, leanRotate } = useCursorPose(avatarRef, follow);

  return (
    <section id="top" className="intro">
      <div className="intro-grid">
        <motion.div
          ref={avatarRef}
          className="intro-avatar"
          style={{ x: leanX, y: leanY, rotate: leanRotate }}
        >
          <Medallion
            className="intro-medallion"
            view={pose}
            preload={follow ? CURSOR_POSES : []}
            eager
          />
        </motion.div>
        <h1 className="intro-title font-display">About {profile.shortName}</h1>
        <p className="intro-bio prose-copy">{profile.bio}</p>

        {credentials.length > 0 && (
          <ul className="intro-credentials" aria-label="Credentials">
            {credentials.map((c, i) => (
              <li key={c.label}>
                <Sticker sticker={c.sticker} tilt={i % 2 === 0 ? -5 : 4} still />
                <span>{c.title}</span>
              </li>
            ))}
          </ul>
        )}

        {profile.cv && (
          <div className="cv-block">
            <a href={`${base}${profile.cv}`} download className="cv-button">
              <Lock size={16} aria-hidden="true" />
              Download CV
            </a>
            <p className="cv-note">
              Password protected.{" "}
              {profile.social.email && (
                <a href={`mailto:${profile.social.email}?subject=${encodeURIComponent("CV access request")}`}>
                  Email me for access
                </a>
              )}
            </p>
          </div>
        )}
      </div>

      <a href="#resume" className="scroll-cue">
        <span>Scroll</span>
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}
