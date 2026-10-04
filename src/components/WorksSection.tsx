import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePortfolio } from "../hooks/usePortfolio";
import { useMediaQuery, useReducedMotion } from "../hooks/useMediaQuery";
import type { Project } from "../types/portfolio";
import Medallion from "./Medallion";

function WorkPanel({ project, index }: { project: Project; index: number }) {
  return (
    <article className="work-panel">
      <p className="work-number">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="work-title font-display">{project.title}</h3>
      <p className="work-subtitle">{project.subtitle}</p>

      <div className="work-visual">
        {project.image ? (
          <img src={project.image} alt={project.title} loading="lazy" />
        ) : (
          <div className="work-swatch" aria-hidden="true">
            <span className="font-display">{project.title}</span>
          </div>
        )}
      </div>

      <p className="work-description prose-copy">{project.description}</p>

      <ul className="work-tags">
        {project.stack.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <p className="work-meta">
        {project.role}, {project.year}
      </p>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="accent-gradient mt-5 inline-flex rounded-full px-5 py-2.5 text-sm font-medium text-black"
        >
          Visit project
        </a>
      )}
    </article>
  );
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => Number(b.highlight) - Number(a.highlight));
}

/* Phones and reduced-motion: a plain vertical list. */
function StackedWorks({ projects }: { projects: Project[] }) {
  return (
    <section id="works" className="section-pad">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="section-title font-display">Projects</h2>
        <div className="works-stack">
          {projects.map((p, i) => (
            <WorkPanel key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SidewaysWorks({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // How far the track has to travel sideways = its width minus the visible window.
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const win = windowRef.current;
      if (!track || !win) return;
      setDistance(Math.max(0, track.scrollWidth - win.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && trackRef.current) {
      ro = new ResizeObserver(measure);
      ro.observe(trackRef.current);
    }
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (v) => -v * distance);
  const bar = useTransform(scrollYProgress, [0, 1], [0.08, 1]);

  return (
    <section
      id="works"
      ref={sectionRef}
      className="works"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="works-sticky">
        <div className="works-side">
          <h2 className="works-heading font-display">Projects</h2>
          <Medallion view="threeQuarter" still className="works-medallion" />
        </div>

        <div ref={windowRef} className="works-window">
          <motion.div ref={trackRef} className="works-track" style={{ x }}>
            {projects.map((p, i) => (
              <WorkPanel key={p.id} project={p} index={i} />
            ))}
          </motion.div>
        </div>

        <div className="works-progress" aria-hidden="true">
          <motion.span style={{ scaleX: bar }} />
        </div>
        <p className="works-cue" aria-hidden="true">
          Keep scrolling
        </p>
      </div>
    </section>
  );
}

export default function WorksSection() {
  const { projects } = usePortfolio();
  const wide = useMediaQuery("(min-width: 768px)");
  const reduced = useReducedMotion();
  const sorted = sortProjects(projects);

  if (sorted.length === 0) return null;
  return wide && !reduced ? (
    <SidewaysWorks projects={sorted} />
  ) : (
    <StackedWorks projects={sorted} />
  );
}
