import { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { usePortfolio } from "../hooks/usePortfolio";
import { useReducedMotion } from "../hooks/useMediaQuery";
import {
  buildTimeline,
  GROUP_LABEL,
  type TimelineEntry,
  type TimelineGroup,
} from "../lib/timeline";
import type { AvatarView } from "../types/portfolio";
import Medallion from "./Medallion";
import Sticker from "./Sticker";

function EntryCard({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="entry">
      <p className="entry-years">{entry.years}</p>
      <div className="entry-head">
        <Sticker sticker={entry.sticker} tilt={-6} still className="entry-badge" />
        <h3 className="entry-title">{entry.title}</h3>
      </div>
      <p className="entry-subtitle">
        {entry.subtitle}
        {entry.location ? `, ${entry.location}` : ""}
      </p>
      {entry.points.length > 0 && (
        <ul className="entry-points">
          {entry.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const GROUPS: TimelineGroup[] = ["work", "study"];

/**
 * The head turns with the story: facing you for the first half of the work
 * history, three-quarter for the second half, and in profile for education.
 */
function viewFor(entry: TimelineEntry): AvatarView {
  if (entry.group === "study") return "side";
  return entry.groupIndex <= Math.ceil(entry.groupSize / 2) ? "front" : "threeQuarter";
}

/* Shown when the visitor prefers reduced motion: same content, no pinning. */
function StaticResume({ entries }: { entries: TimelineEntry[] }) {
  return (
    <section id="resume" className="section-pad">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="section-title font-display">Résumé</h2>
        <div className="mt-10 grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Medallion
            stickers={entries.map((e) => e.sticker)}
            still
            set="resume"
            className="static-medallion"
          />
          <div>
            {GROUPS.map((group) => {
              const items = entries.filter((e) => e.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group} className="static-group">
                  <h3 className="static-group-name">{GROUP_LABEL[group]}</h3>
                  <ol className="static-list">
                    {items.map((entry) => (
                      <li key={entry.key}>
                        <EntryCard entry={entry} />
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ResumeSection() {
  const data = usePortfolio();
  const entries = useMemo(() => buildTimeline(data), [data]);
  const reduced = useReducedMotion();

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(entries.length - 1, Math.max(0, Math.floor(v * entries.length)));
    setActive((prev) => (prev === next ? prev : next));
  });

  // The monogram fallback turns like a coin; the character turns via its angles.
  const turn = useTransform(scrollYProgress, [0, 1], [-22, 22]);
  const zoom = useTransform(scrollYProgress, [0, 1], [0.96, 1.04]);

  if (entries.length === 0) return null;
  if (reduced) return <StaticResume entries={entries} />;

  const current = entries[active];

  return (
    <section
      id="resume"
      ref={ref}
      className="resume"
      style={{ height: `calc(${entries.length} * 70vh + 100vh)` }}
    >
      {/* Full content for screen readers; the animated view below is visual only. */}
      <div className="sr-only">
        {GROUPS.map((group) => {
          const items = entries.filter((e) => e.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group}>
              <h3>{GROUP_LABEL[group]}</h3>
              <ol>
                {items.map((e) => (
                  <li key={e.key}>
                    {e.years}: {e.subtitle}, {e.title}
                    {e.location ? `, ${e.location}` : ""}. {e.points.join(". ")}
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>

      <div className="resume-sticky" aria-hidden="true">
        <h2 className="resume-heading font-display">Résumé</h2>

        <Medallion
          stickers={entries.map((e) => e.sticker)}
          shown={active + 1}
          view={viewFor(current)}
          preload={["threeQuarter", "side"]}
          set="resume"
          turn={turn}
          zoom={zoom}
          className="resume-medallion"
        />

        <div className="resume-rail">
          <div className="rail-group">
            <p className="rail-group-name">{GROUP_LABEL[current.group]}</p>
            <p className="rail-count">
              {String(current.groupIndex).padStart(2, "0")} /{" "}
              {String(current.groupSize).padStart(2, "0")}
            </p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -28 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <EntryCard entry={current} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
