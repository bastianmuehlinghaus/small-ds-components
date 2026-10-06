import { forwardRef } from "react";
import type { SVGProps } from "react";
import { cx } from "../../cx";
import styles from "./Icon.module.css";

/* The icon set mirrors the Icon components in the Figma components file. Paths
   are exported from Figma unchanged, on its 16px grid, and fill with
   currentColor so the surrounding component decides the colour — in Figma they
   bind color/content/default. Decorative by default; pass `aria-label` (and
   `aria-hidden={false}`) for an icon that carries meaning on its own. */

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
  "M8.83083 8L5.76417 4.93334L6.46667 4.23083L10.2358 8L6.46667 11.7692L5.76417 11.0667L8.83083 8Z",
);

/** Figma: `Icon / <chevron-down>` */
export const ChevronDownIcon = createIcon(
  "ChevronDownIcon",
  "M8 8.83084L11.0667 5.76418L11.7692 6.46668L8 10.2358L4.23083 6.46668L4.93333 5.76418L8 8.83084Z",
);

/** Figma: `Icon / <chevron-up>` */
export const ChevronUpIcon = createIcon(
  "ChevronUpIcon",
  "M8 7.16917L4.93334 10.2358L4.23083 9.53334L8 5.76417L11.7692 9.53334L11.0667 10.2358L8 7.16917Z",
);

/** Figma: `Icon / <checkmark>` */
export const CheckmarkIcon = createIcon(
  "CheckmarkIcon",
  "M6.55633 11.5358L3 7.9795L3.71267 7.26667L6.55633 10.1103L12.6667 4L13.3793 4.71283L6.55633 11.5358Z",
);

/** Figma: `Icon / <dash>` — the same 1px weight as the checkmark, centred on
 *  the grid and on whole pixel rows. */
export const DashIcon = createIcon("DashIcon", "M3.5 7.5H12.5V8.5H3.5V7.5Z");
