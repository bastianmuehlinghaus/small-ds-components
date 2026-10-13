import { forwardRef } from "react";
import type { SVGProps } from "react";
import { cx } from "../../cx";
import styles from "./Icon.module.css";

/* The icon set mirrors the Icon components in the Figma components file. Paths
   are the same outlines as in Figma, on its 16px grid, and fill with
   currentColor so the surrounding component decides the colour — in Figma they
   bind color/content/default. Decorative by default; pass `aria-label` (and
   `aria-hidden={false}`) for an icon that carries meaning on its own.

   Every glyph is a 1px line at 16px, outlined. The weight is in the geometry,
   not a stroke, so it scales with the icon (1.25 at 20, 1.5 at 24), as in
   Figma. A 1.3px line was tried (#71) and reverted (#108). */

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

/** Figma: `Icon / <close>` — two 1px diagonals centred on the grid, the same
 *  weight as the checkmark and dash. */
export const CloseIcon = createIcon(
  "CloseIcon",
  "M4.35355 3.64645L8 7.29289L11.6464 3.64645L12.3536 4.35355L8.70711 8L12.3536 11.6464L11.6464 12.3536L8 8.70711L4.35355 12.3536L3.64645 11.6464L7.29289 8L3.64645 4.35355L4.35355 3.64645Z",
);

/* The four status glyphs are filled shapes with the mark knocked out, so they
   read at a glance in a Section message. Their marks keep the 1px weight of
   the line icons, and sit on whole pixel columns. */

/** Figma: `Icon / <success>` */
export const SuccessIcon = createIcon(
  "SuccessIcon",
  "M7.05385 10.8358L11.5359 6.35382L10.8334 5.65132L7.05385 9.43082L5.15385 7.53082L4.45135 8.23332L7.05385 10.8358ZM8.00119 14.3333C7.12519 14.3333 6.3018 14.1671 5.53102 13.8347C4.76024 13.5022 4.0898 13.051 3.51969 12.4812C2.94958 11.9113 2.49819 11.2411 2.16552 10.4707C1.83296 9.70021 1.66669 8.87705 1.66669 8.00116C1.66669 7.12516 1.83291 6.30177 2.16535 5.53099C2.4978 4.76021 2.94896 4.08977 3.51885 3.51966C4.08874 2.94955 4.75891 2.49816 5.52935 2.16549C6.2998 1.83293 7.12296 1.66666 7.99885 1.66666C8.87485 1.66666 9.69824 1.83288 10.469 2.16532C11.2398 2.49777 11.9102 2.94893 12.4804 3.51882C13.0505 4.08871 13.5019 4.75888 13.8345 5.52932C14.1671 6.29977 14.3334 7.12293 14.3334 7.99882C14.3334 8.87482 14.1671 9.69821 13.8347 10.469C13.5022 11.2398 13.0511 11.9102 12.4812 12.4803C11.9113 13.0504 11.2411 13.5018 10.4707 13.8345C9.70024 14.167 8.87708 14.3333 8.00119 14.3333Z",
);

/** Figma: `Icon / <info>` */
export const InfoIcon = createIcon(
  "InfoIcon",
  "M7.50002 11.1667H8.50002V7.33332H7.50002V11.1667ZM8.38202 6.03749C8.48635 5.93427 8.53852 5.80638 8.53852 5.65382C8.53852 5.50127 8.48691 5.37338 8.38369 5.27016C8.28046 5.16705 8.15258 5.11549 8.00002 5.11549C7.84746 5.11549 7.71958 5.16705 7.61635 5.27016C7.51313 5.37338 7.46152 5.50127 7.46152 5.65382C7.46152 5.80638 7.51369 5.93427 7.61802 6.03749C7.72224 6.14071 7.84958 6.19232 8.00002 6.19232C8.15046 6.19232 8.2778 6.14071 8.38202 6.03749ZM8.00119 14.3333C7.12519 14.3333 6.3018 14.1671 5.53102 13.8347C4.76024 13.5022 4.0898 13.051 3.51969 12.4812C2.94958 11.9113 2.49819 11.2411 2.16552 10.4707C1.83296 9.70021 1.66669 8.87705 1.66669 8.00116C1.66669 7.12516 1.83291 6.30177 2.16535 5.53099C2.4978 4.76021 2.94896 4.08977 3.51885 3.51966C4.08874 2.94955 4.75891 2.49816 5.52935 2.16549C6.2998 1.83293 7.12296 1.66666 7.99885 1.66666C8.87485 1.66666 9.69824 1.83288 10.469 2.16532C11.2398 2.49777 11.9102 2.94893 12.4804 3.51882C13.0505 4.08871 13.5019 4.75888 13.8345 5.52932C14.1671 6.29977 14.3334 7.12293 14.3334 7.99882C14.3334 8.87482 14.1671 9.69821 13.8347 10.469C13.5022 11.2398 13.0511 11.9102 12.4812 12.4803C11.9113 13.0504 11.2411 13.5018 10.4707 13.8345C9.70024 14.167 8.87708 14.3333 8.00119 14.3333Z",
);

/** Figma: `Icon / <warning>` */
export const WarningIcon = createIcon(
  "WarningIcon",
  "M1.24365 13.8333L7.99999 2.16666L14.7563 13.8333H1.24365ZM8.38199 11.882C8.48632 11.7778 8.53849 11.6504 8.53849 11.5C8.53849 11.3495 8.48632 11.2222 8.38199 11.118C8.27776 11.0137 8.15043 10.9615 7.99999 10.9615C7.84954 10.9615 7.72221 11.0137 7.61799 11.118C7.51365 11.2222 7.46149 11.3495 7.46149 11.5C7.46149 11.6504 7.51365 11.7778 7.61799 11.882C7.72221 11.9863 7.84954 12.0385 7.99999 12.0385C8.15043 12.0385 8.27776 11.9863 8.38199 11.882ZM7.49999 10.2948H8.49999V6.96149H7.49999V10.2948Z",
);

/** Figma: `Icon / <error>` */
export const ErrorIcon = createIcon(
  "ErrorIcon",
  "M7.50002 8.72432H8.50002V4.98082H7.50002V8.72432ZM8.38202 10.3115C8.48635 10.2073 8.53852 10.0799 8.53852 9.92949C8.53852 9.77904 8.48635 9.65171 8.38202 9.54749C8.2778 9.44316 8.15046 9.39099 8.00002 9.39099C7.84958 9.39099 7.72224 9.44316 7.61802 9.54749C7.51369 9.65171 7.46152 9.77904 7.46152 9.92949C7.46152 10.0799 7.51369 10.2073 7.61802 10.3115C7.72224 10.4158 7.84958 10.468 8.00002 10.468C8.15046 10.468 8.2778 10.4158 8.38202 10.3115ZM8.00002 14.7257L1.27435 7.99999L8.00002 1.27432L14.7257 7.99999L8.00002 14.7257Z",
);
