import { forwardRef } from "react";
import type { SVGProps } from "react";
import { cx } from "../../cx";
import styles from "./Icon.module.css";

/* The icon set mirrors the Icon components in the Figma components file. Paths
   are the same outlines as in Figma, on its 16px grid, and fill with
   currentColor so the surrounding component decides the colour — in Figma they
   bind color/content/default. Decorative by default; pass `aria-label` (and
   `aria-hidden={false}`) for an icon that carries meaning on its own.

   Every glyph is a 1.3px line at 16px, outlined: butt ends, mitred corners.
   The weight is in the geometry, not a stroke, so it scales with the icon
   (1.625 at 20, 1.95 at 24), as in Figma. 1.3 cannot sit on whole pixels, so
   straight edges render slightly soft on 1x screens; that is accepted. */

export type IconProps = SVGProps<SVGSVGElement>;

const createIcon = (name: string, d: string) => {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        className={cx(styles.icon, className)}
        {...props}
      >
        <path d={d} />
      </svg>
    );
  });
  Icon.displayName = name;
  return Icon;
};

/** Figma: `Icon / <chevron-right>` */
export const ChevronRightIcon = createIcon(
  "ChevronRightIcon",
  "M8.61409 8L5.6558 5.0417L6.57504 4.12246L10.45257 8L6.57504 11.87754L5.6558 10.9583Z",
);

/** Figma: `Icon / <chevron-down>` */
export const ChevronDownIcon = createIcon(
  "ChevronDownIcon",
  "M8 8.61409L10.9583 5.6558L11.87754 6.57504L8 10.45257L4.12246 6.57504L5.0417 5.6558Z",
);

/** Figma: `Icon / <chevron-up>` */
export const ChevronUpIcon = createIcon(
  "ChevronUpIcon",
  "M8 7.38591L5.0417 10.3442L4.12246 9.42496L8 5.54743L11.87754 9.42496L10.9583 10.3442Z",
);

/** Figma: `Icon / <checkmark>` */
export const CheckmarkIcon = createIcon(
  "CheckmarkIcon",
  "M6.55633 11.74232L2.89671 8.0827L3.81595 7.16346L6.55633 9.90384L12.56338 3.8968L13.48262 4.81604Z",
);

/** Figma: `Icon / <dash>` — the same weight as the checkmark, centred on the
 *  grid. */
export const DashIcon = createIcon("DashIcon", "M3.5 7.35H12.5V8.65H3.5Z");

/** Figma: `Icon / <close>` — two diagonals centred on the grid, the same
 *  weight as the checkmark and dash. */
export const CloseIcon = createIcon(
  "CloseIcon",
  "M4.45962 3.54038L8 7.08076L11.54038 3.54038L12.45962 4.45962L8.91924 8L12.45962 11.54038L11.54038 12.45962L8 8.91924L4.45962 12.45962L3.54038 11.54038L7.08076 8L3.54038 4.45962Z",
);
