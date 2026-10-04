import { useEffect, useState, type RefObject } from "react";
import { useSpring, type MotionValue } from "framer-motion";
import type { AvatarView } from "../types/portfolio";

export const CURSOR_POSES: AvatarView[] = [
  "front",
  "threeQuarter",
  "threeQuarterLeft",
  "lookUp",
  "lookUpLeft",
  "lookUpRight",
];

interface CursorPose {
  pose: AvatarView;
  /** A small lean towards the cursor, layered on top of the pose */
  leanX: MotionValue<number>;
  leanY: MotionValue<number>;
  leanRotate: MotionValue<number>;
}

// Thresholds are fractions of half the screen. Each zone has a separate
// "enter" and "leave" value so the head doesn't flicker on a boundary.
const SIDE_ENTER = 0.2;
const SIDE_LEAVE = 0.12;
const UP_ENTER = 0.3;
const UP_LEAVE = 0.2;

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Turns the character's head towards the mouse, or towards the finger on
 * touch screens. On phones he also glances left and right once after the
 * page loads, so visitors can see that he moves.
 * Only active when `enabled` (motion allowed and a character is set).
 */
export function useCursorPose(
  target: RefObject<HTMLElement | null>,
  enabled: boolean,
): CursorPose {
  const [pose, setPose] = useState<AvatarView>("front");
  const spring = { stiffness: 140, damping: 20, mass: 0.6 };
  const leanX = useSpring(0, spring);
  const leanY = useSpring(0, spring);
  const leanRotate = useSpring(0, spring);

  useEffect(() => {
    const reset = () => {
      setPose("front");
      leanX.set(0);
      leanY.set(0);
      leanRotate.set(0);
    };

    if (!enabled) {
      reset();
      return;
    }

    let frame = 0;
    let pointer = { x: 0, y: 0 };
    let horizontal: -1 | 0 | 1 = 0;
    let up = false;

    const update = () => {
      frame = 0;
      const el = target.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      // Measure from his face (about 40% down the picture), not the box centre.
      const faceX = box.left + box.width / 2;
      const faceY = box.top + box.height * 0.4;
      const dx = (pointer.x - faceX) / (window.innerWidth / 2);
      const dy = (pointer.y - faceY) / (window.innerHeight / 2);

      if (Math.abs(dx) < SIDE_LEAVE) horizontal = 0;
      else if (dx > SIDE_ENTER) horizontal = 1;
      else if (dx < -SIDE_ENTER) horizontal = -1;
      else if (horizontal !== 0 && Math.sign(dx) !== horizontal) horizontal = 0;

      if (dy < -UP_ENTER) up = true;
      else if (dy > -UP_LEAVE) up = false;

      const next: AvatarView = up
        ? horizontal < 0
          ? "lookUpLeft"
          : horizontal > 0
            ? "lookUpRight"
            : "lookUp"
        : horizontal < 0
          ? "threeQuarterLeft"
          : horizontal > 0
            ? "threeQuarter"
            : "front";

      setPose((prev) => (prev === next ? prev : next));
      leanX.set(clamp(dx) * 10);
      leanY.set(clamp(dy) * 6);
      leanRotate.set(clamp(dx) * 2.5);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      pointer = { x: e.clientX, y: e.clientY };
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    // Touch: follow the finger while it is on the screen (taps and swipes),
    // then face forward again shortly after it lifts.
    let release = 0;
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      window.clearTimeout(release);
      stopGlance();
      pointer = { x: t.clientX, y: t.clientY };
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const onTouchEnd = () => {
      window.clearTimeout(release);
      release = window.setTimeout(() => {
        horizontal = 0;
        up = false;
        reset();
      }, 1400);
    };

    // A one-off glance on touch-only devices: left, right, then back to you.
    const timers: number[] = [];
    const stopGlance = () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
    };
    const touchOnly =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (touchOnly) {
      const glance: [number, AvatarView, number][] = [
        [900, "threeQuarterLeft", -1],
        [2000, "threeQuarter", 1],
        [3100, "front", 0],
      ];
      glance.forEach(([at, view, dir]) => {
        timers.push(
          window.setTimeout(() => {
            setPose(view);
            leanX.set(dir * 8);
            leanRotate.set(dir * 2);
          }, at),
        );
      });
    }

    const onLeave = () => {
      horizontal = 0;
      up = false;
      reset();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(release);
      stopGlance();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled, target, leanX, leanY, leanRotate]);

  return { pose, leanX, leanY, leanRotate };
}
