import { Children, cloneElement, forwardRef, isValidElement } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactElement, ReactNode } from "react";
import { cx } from "../../cx";
import { Button } from "../Button";
import { ArrowLeftIcon } from "../Icon";
import styles from "./Header.module.css";

/* The heading at the top of a page, a section or a sub-section, with what
   belongs beside it: a subtitle, and on a page a back button and actions.
   Three levels and no fourth: below a sub-section a heading belongs to a
   component (Section message, Accordion), which brings its own. A `<div>`,
   not `<header>`, which outside `main` would be the page's banner landmark.
   No outer margin: the page decides the space around it. */

export type HeaderLevel = "page" | "section" | "subsection";

const defaultHeading = { page: "h1", section: "h2", subsection: "h3" } as const;

interface HeaderBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  /** The heading text. */
  title: ReactNode;
  /** The title's element, so it fits the page's outline. Changes the element
   *  only, not the look. Defaults to `h1`, `h2` and `h3` by level. */
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export type HeaderProps = HeaderBaseProps &
  (
    | {
        /** Heading/Large over Body/Small. */
        level: "page";
        /** A line under the title. */
        subtitle?: ReactNode;
        /** A `HeaderBack` before the title. */
        back?: ReactNode;
        /** Buttons at the end, one or a fragment of several. They wrap below
         *  the title when they don't fit beside it. */
        actions?: ReactNode;
      }
    | {
        /** Heading/Small over Body/XSmall. */
        level: "section";
        subtitle?: ReactNode;
        back?: never;
        actions?: never;
      }
    | {
        /** Heading/XSmall, alone. */
        level: "subsection";
        subtitle?: never;
        back?: never;
        actions?: never;
      }
  );

export const Header = forwardRef<HTMLDivElement, HeaderProps>(function Header(
  { level, title, subtitle, back, actions, headingLevel, className, ...props },
  ref,
) {
  const Heading = headingLevel ?? defaultHeading[level];
  const isPage = level === "page";
  const hasSubtitle = level !== "subsection" && subtitle != null && subtitle !== false && subtitle !== "";

  return (
    <div ref={ref} className={cx(styles.header, className)} {...props}>
      <div className={styles.main}>
        {/* The back button and the actions take the title's line height, so
            they are centred on its first line at any font size. */}
        {isPage && back && <div className={styles.edge}>{back}</div>}
        <div className={styles.text}>
          <Heading className={cx(styles.title, styles[`${level}Title`])}>{title}</Heading>
          {hasSubtitle && <p className={cx(styles.subtitle, styles[`${level}Subtitle`])}>{subtitle}</p>}
        </div>
      </div>
      {isPage && actions && <div className={cx(styles.edge, styles.actions)}>{actions}</div>}
    </div>
  );
});

export interface HeaderBackProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Makes it a link to the previous page. Without it, it is a button. */
  href?: string;
  /** The accessible name. Defaults to "Back". Translate it. */
  label?: string;
  /** Put the back button's styles and icon on your own link, such as a
   *  router's: `<HeaderBack asChild><RouterLink to="/" /></HeaderBack>`. */
  asChild?: boolean;
  children?: ReactElement;
}

/** The back button in a page Header: a `subtle`, icon-only Button with an
 *  arrow, an `<a>` with `href` and a `<button>` without. */
export const HeaderBack = forwardRef<HTMLButtonElement, HeaderBackProps>(function HeaderBack(
  { href, label = "Back", asChild = false, children, ...props },
  ref,
) {
  const icon = <ArrowLeftIcon />;
  if (asChild && isValidElement(children)) {
    return (
      <Button ref={ref} variant="subtle" iconOnly asChild aria-label={label} {...props}>
        {cloneElement(Children.only(children), undefined, icon)}
      </Button>
    );
  }
  if (href != null) {
    return (
      <Button ref={ref} variant="subtle" iconOnly asChild aria-label={label} {...props}>
        <a href={href}>{icon}</a>
      </Button>
    );
  }
  return (
    <Button ref={ref} variant="subtle" iconOnly aria-label={label} {...props}>
      {icon}
    </Button>
  );
});
