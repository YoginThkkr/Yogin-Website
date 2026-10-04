import { motion, type MotionValue } from "framer-motion";
import { usePortfolio } from "../hooks/usePortfolio";
import type { AvatarView, Sticker as StickerData } from "../types/portfolio";
import Sticker from "./Sticker";

/* Where stickers land (percent of the picture) and their tilt.
   Short labels use "side" spots, long labels (e.g. "SPRING MAN") use "wide"
   spots with room for them. Spots are listed in the order they get used. */
type Spot = { x: number; y: number; tilt: number };
type SpotSet = { side: Spot[]; wide: Spot[] };

/* Evenly around the rim of the YT monogram (used when there is no character image) */
const MONOGRAM_SPOTS: SpotSet = {
  side: [
    { x: 17, y: 15, tilt: -12 },
    { x: 83, y: 15, tilt: 10 },
    { x: 3, y: 58, tilt: 8 },
    { x: 97, y: 58, tilt: -9 },
    { x: 16, y: 84, tilt: 12 },
    { x: 84, y: 84, tilt: -12 },
    { x: 4, y: 35, tilt: -6 },
    { x: 96, y: 35, tilt: 7 },
    { x: 50, y: 2, tilt: 3 },
    { x: 42, y: 97, tilt: -5 },
  ],
  wide: [
    { x: 50, y: 98, tilt: -4 },
    { x: 50, y: -1, tilt: 4 },
  ],
};

/* On the character, per angle. Measured from the images; the eyes stay clear. */
const FACE_SPOTS: Partial<Record<AvatarView, SpotSet>> = {
  front: {
    side: [
      { x: 33, y: 57, tilt: -12 }, // left cheek
      { x: 67, y: 57, tilt: 10 }, // right cheek
      { x: 27, y: 15, tilt: -8 }, // hair, top left
      { x: 72, y: 14, tilt: 12 }, // hair, top right
      { x: 12, y: 45, tilt: 9 }, // hair, left side
      { x: 50, y: 83, tilt: -6 }, // neck
    ],
    wide: [
      { x: 50, y: 24, tilt: -3 }, // forehead
      { x: 50, y: 71, tilt: 4 }, // chin
    ],
  },
  threeQuarter: {
    side: [
      { x: 41, y: 58, tilt: -12 },
      { x: 74, y: 53, tilt: 10 },
      { x: 26, y: 17, tilt: -8 },
      { x: 76, y: 13, tilt: 12 },
      { x: 13, y: 50, tilt: 9 },
      { x: 52, y: 83, tilt: -6 },
    ],
    wide: [
      { x: 57, y: 24, tilt: -3 },
      { x: 56, y: 70, tilt: 5 },
    ],
  },
  side: {
    side: [
      { x: 67, y: 55, tilt: -10 }, // cheek
      { x: 22, y: 38, tilt: 8 }, // back of the hair
      { x: 36, y: 27, tilt: -12 }, // crown
      { x: 25, y: 62, tilt: 10 }, // hair, lower back
      { x: 60, y: 82, tilt: -6 }, // neck
      { x: 68, y: 15, tilt: 12 }, // fringe
    ],
    wide: [
      { x: 45, y: 16, tilt: -4 }, // top of the head
      { x: 73, y: 69, tilt: 5 }, // jaw
    ],
  },
  back: {
    side: [
      { x: 30, y: 30, tilt: -10 },
      { x: 68, y: 30, tilt: 10 },
      { x: 25, y: 55, tilt: 8 },
      { x: 72, y: 55, tilt: -8 },
      { x: 40, y: 70, tilt: 6 },
      { x: 60, y: 72, tilt: -6 },
    ],
    wide: [
      { x: 50, y: 18, tilt: -3 },
      { x: 50, y: 44, tilt: 4 },
    ],
  },
};

/* On the résumé character (front view only). Work stickers land on the
   shoulders and hair first; education fills the cheeks and collar.
   Eyes and mouth stay clear. */
const RESUME_SPOTS: SpotSet = {
  side: [
    { x: 17, y: 65, tilt: -10 }, // left shoulder
    { x: 83, y: 65, tilt: 9 }, // right shoulder
    { x: 36, y: 14, tilt: -8 }, // hair, left
    { x: 65, y: 13, tilt: 11 }, // hair, right
    { x: 27, y: 76, tilt: 7 }, // jacket, left
    { x: 73, y: 76, tilt: -7 }, // jacket, right
    { x: 34, y: 45, tilt: -10 }, // left cheek
    { x: 69, y: 45, tilt: 9 }, // right cheek
    { x: 50, y: 67, tilt: -4 }, // collar
  ],
  wide: [
    { x: 50, y: 22, tilt: -3 }, // forehead
    { x: 50, y: 76, tilt: 4 }, // chest
  ],
};

function assignSpots(stickers: StickerData[], set: SpotSet): Spot[] {
  let side = 0;
  let wide = 0;
  return stickers.map((s) => {
    if (s.label.length > 6 && wide < set.wide.length) return set.wide[wide++];
    const spot = set.side[side % set.side.length];
    side += 1;
    return spot;
  });
}

const VIEWS: AvatarView[] = [
  "front",
  "threeQuarter",
  "threeQuarterLeft",
  "side",
  "back",
  "lookUp",
  "lookUpLeft",
  "lookUpRight",
];

interface Props {
  stickers?: StickerData[];
  /** How many stickers are currently stuck on (the rest are hidden) */
  shown?: number;
  /** Which way the character faces (falls back to front if that angle is missing) */
  view?: AvatarView;
  /** Other angles to keep loaded so switching to them is instant */
  preload?: AvatarView[];
  /** Coin-like turn for the monogram only, in degrees */
  turn?: MotionValue<number>;
  zoom?: MotionValue<number>;
  still?: boolean;
  /** Load the picture straight away (for the first screen) */
  eager?: boolean;
  /** Which character to show: the main one, or the résumé one */
  set?: "main" | "resume";
  className?: string;
}

export default function Medallion({
  stickers = [],
  shown = stickers.length,
  view = "front",
  preload = [],
  turn,
  zoom,
  still = false,
  eager = false,
  set = "main",
  className = "",
}: Props) {
  const { profile } = usePortfolio();
  const base = import.meta.env.BASE_URL;
  const useResume = set === "resume" && Boolean(profile.avatarResume);
  const angles = useResume ? profile.avatarResume : profile.avatar;
  const activeView: AvatarView = angles && angles[view] ? view : "front";
  const spots = assignSpots(
    stickers,
    !angles
      ? MONOGRAM_SPOTS
      : useResume
        ? RESUME_SPOTS
        : (FACE_SPOTS[activeView] ?? FACE_SPOTS.front!),
  );
  const wanted = new Set<AvatarView>(["front", activeView, ...preload]);

  return (
    <div
      className={`medallion-stage ${angles ? "medallion-stage--image" : ""} ${useResume ? "medallion-stage--resume" : ""} ${className}`}
    >
      <motion.div
        className="medallion"
        style={angles ? { scale: zoom } : { rotateY: turn, scale: zoom }}
      >
        {angles ? (
          // The angles this view needs are all in the page; only the active one is
          // shown, so turning the head never waits for a download.
          <div className="medallion-face" role="img" aria-label={`${profile.name}, illustrated`}>
            {VIEWS.filter((v) => angles[v] && wanted.has(v)).map((v) => (
              <picture
                key={v}
                className={`avatar-angle ${v === activeView ? "avatar-angle--on" : ""}`}
              >
                <source srcSet={`${base}${angles[v]}.webp`} type="image/webp" />
                <img
                  src={`${base}${angles[v]}.png`}
                  alt=""
                  width={622}
                  height={832}
                  decoding="async"
                  loading={eager ? "eager" : "lazy"}
                />
              </picture>
            ))}
          </div>
        ) : (
          <div
            className="medallion-face"
            role="img"
            aria-label={`${profile.name} monogram`}
            dangerouslySetInnerHTML={{ __html: profile.avatarSvg }}
          />
        )}

        {stickers.map((sticker, i) => {
          const spot = spots[i];
          return (
            <motion.span
              key={`${sticker.label}-${i}`}
              className="medallion-spot"
              initial={false}
              animate={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              transition={still ? { duration: 0 } : { duration: 0.45, ease: "easeInOut" }}
            >
              <Sticker
                sticker={sticker}
                tilt={spot.tilt}
                visible={i < shown}
                still={still}
              />
            </motion.span>
          );
        })}
      </motion.div>
    </div>
  );
}
