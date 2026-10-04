import { motion } from "framer-motion";
import type { Sticker as StickerData } from "../types/portfolio";

interface Props {
  sticker: StickerData;
  /** Resting tilt in degrees */
  tilt?: number;
  /** When false the sticker is "peeled off" (hidden) */
  visible?: boolean;
  /** Skip the pop animation (reduced motion) */
  still?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** A die-cut vinyl sticker: white border, thin black edge, black text. */
export default function Sticker({
  sticker,
  tilt = 0,
  visible = true,
  still = false,
  className = "",
  style,
}: Props) {
  return (
    <motion.span
      aria-hidden="true"
      className={`sticker sticker--${sticker.shape} ${className}`}
      style={{ backgroundColor: sticker.color, ...style }}
      initial={false}
      animate={
        visible
          ? { scale: 1, rotate: tilt, opacity: 1 }
          : { scale: 0.2, rotate: tilt + 25, opacity: 0 }
      }
      transition={
        still
          ? { duration: 0 }
          : { type: "spring", stiffness: 420, damping: 18, mass: 0.6 }
      }
    >
      {sticker.label}
    </motion.span>
  );
}
