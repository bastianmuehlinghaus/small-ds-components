import { Children, cloneElement, createContext, forwardRef, isValidElement, useContext, useId } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
} from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "../../cx";
import { Button } from "../Button";
import { ChevronDownIcon } from "../Icon";
import styles from "./Sidebar.module.css";

/* A sidebar is page navigation, not a widget: links in lists, in a <nav>.
   Tab moves through it as through any links, so Radix has no primitive for
   it and none is needed. The one piece of behaviour is a collapsible
   section, which is Radix Collapsible (a disclosure button and its region).

   Every row shares one start edge: the sidebar's `inset-sm` plus the row's
   `inset-sm` puts the header item's icon, every item's icon and every section
   title's text 16 from the edge. A nested item starts at its parent's label. */

/** Items inside a nested list are indented to their parent's label, one level deep. */
const Nested = createContext(false);

export type SidebarProps = ComponentPropsWithoutRef<"nav">;

/** The sidebar itself. Name it with `aria-label` when the page has another `<nav>`. */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { className, ...props },
  ref,
) {
  return <nav ref={ref} className={cx(styles.root, className)} {...props} />;
});

export type SidebarHeaderProps = ComponentPropsWithoutRef<"div">;

/** The top row: a header item, then header actions at the end. */
export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(function SidebarHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(styles.header, className)} {...props} />;
});

export interface SidebarHeaderItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** A logo or avatar before the label, drawn at icon size. */
  icon?: ReactNode;
  /** The chevron that says the item opens a menu. On by default: a header
   *  item is usually a workspace switcher, a `DropdownMenu` trigger. */
  showChevron?: boolean;
}

/** The workspace or product name at the top, as a button. Wrap it in
 *  `DropdownMenu.Trigger asChild` to make it a switcher. */
export const SidebarHeaderItem = forwardRef<HTMLButtonElement, SidebarHeaderItemProps>(
  function SidebarHeaderItem({ icon, showChevron = true, className, children, type, ...props }, ref) {
    return (
      <button ref={ref} type={type ?? "button"} className={cx(styles.row, styles.headerItem, className)} {...props}>
        {icon != null && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{children}</span>
        {showChevron && <ChevronDownIcon className={styles.headerChevron} />}
      </button>
    );
  },
);

export interface SidebarHeaderActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The action's name. Required: the button shows only its icon. */
  "aria-label": string;
}

/** An icon button in the header row, such as Search or New issue: a
 *  `subtle`, icon-only Button. */
export const SidebarHeaderAction = forwardRef<HTMLButtonElement, SidebarHeaderActionProps>(
  function SidebarHeaderAction({ className, ...props }, ref) {
    return <Button ref={ref} variant="subtle" iconOnly className={cx(styles.headerAction, className)} {...props} />;
  },
);

export type SidebarContentProps = ComponentPropsWithoutRef<"div">;

/** The sections. It takes the height the header and footer leave, and scrolls. */
export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(function SidebarContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(styles.content, className)} {...props} />;
});

export type SidebarFooterProps = ComponentPropsWithoutRef<"div">;

/** Pinned to the bottom, under the content: settings, help, the signed-in user. */
export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(function SidebarFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx(styles.footer, className)} {...props} />;
});

export interface SidebarSectionProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** The section's name, which also names its list. Optional: the first
   *  section often has none. */
  title?: ReactNode;
  /** Makes the title a disclosure button that shows and hides the items. */
  collapsible?: boolean;
  /** Collapsible only: open on first render. Defaults to open. */
  defaultOpen?: boolean;
  /** Collapsible only: controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** A titled group of items. Its children are `SidebarItem`s. */
export const SidebarSection = forwardRef<HTMLDivElement, SidebarSectionProps>(function SidebarSection(
  { title, collapsible = false, defaultOpen = true, open, onOpenChange, className, children, ...props },
  ref,
) {
  const titleId = useId();
  const list = (
    <ul className={styles.list} aria-labelledby={title != null ? titleId : undefined}>
      {children}
    </ul>
  );

  if (collapsible && title != null) {
    return (
      <Collapsible.Root
        ref={ref}
        className={cx(styles.section, className)}
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        {...props}
      >
        <Collapsible.Trigger className={cx(styles.sectionTitle, styles.sectionTrigger)}>
          <span id={titleId} className={styles.label}>{title}</span>
          <ChevronDownIcon className={styles.sectionChevron} />
        </Collapsible.Trigger>
        <Collapsible.Content className={styles.collapsibleContent}>{list}</Collapsible.Content>
      </Collapsible.Root>
    );
  }

  return (
    <div ref={ref} className={cx(styles.section, className)} {...props}>
      {title != null && (
        <div id={titleId} className={styles.sectionTitle}>
          <span className={styles.label}>{title}</span>
        </div>
      )}
      {list}
    </div>
  );
});

type SidebarItemOwnProps = {
  /** An icon before the label. */
  iconBefore?: ReactNode;
  /** An icon after the label, at the end of the row. */
  iconAfter?: ReactNode;
  /** The page the user is on. Sets `aria-current="page"` and the selected fill. */
  current?: boolean;
  /** `SidebarItem`s listed under this one, indented to its label. One level:
   *  a nested item's own `nestedItems` are ignored. */
  nestedItems?: ReactNode;
};

type SidebarItemAsAnchor = SidebarItemOwnProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; asChild?: false };
type SidebarItemAsButton = SidebarItemOwnProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; asChild?: false };
type SidebarItemAsChild = SidebarItemOwnProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    /** Render the child element as the row, such as a router's link:
     *  `<SidebarItem asChild><RouterLink to="/x">Inbox</RouterLink></SidebarItem>`.
     *  The icons and label are put inside it. */
    asChild: true;
  };

export type SidebarItemProps = SidebarItemAsAnchor | SidebarItemAsButton | SidebarItemAsChild;

/** The row's content, in its own boxes so the label can truncate. */
function RowContent({ iconBefore, iconAfter, label }: { iconBefore?: ReactNode; iconAfter?: ReactNode; label: ReactNode }) {
  return (
    <>
      {iconBefore != null && <span className={styles.icon}>{iconBefore}</span>}
      <span className={styles.label}>{label}</span>
      {iconAfter != null && <span className={cx(styles.icon, styles.iconAfter)}>{iconAfter}</span>}
    </>
  );
}

/** A link in the sidebar: an `<a>` with `href`, a `<button>` without. */
export const SidebarItem = forwardRef<HTMLAnchorElement | HTMLButtonElement, SidebarItemProps>(
  function SidebarItem({ iconBefore, iconAfter, current = false, nestedItems, className, children, ...props }, ref) {
    const nested = useContext(Nested);
    const shared = {
      className: cx(styles.row, styles.item, nested && styles.nestedItem, className),
      "aria-current": current ? ("page" as const) : undefined,
      "data-current": current ? "" : undefined,
    };

    let row: ReactNode;
    if (props.asChild) {
      // The consumer's element becomes the row, so the content goes inside it
      // rather than inside an element of ours.
      const { asChild: _asChild, ...rest } = props;
      const child = Children.only(children);
      row = (
        <Slot ref={ref as Ref<HTMLAnchorElement>} {...rest} {...shared}>
          {isValidElement<{ children?: ReactNode }>(child)
            ? cloneElement(
                child,
                undefined,
                <RowContent iconBefore={iconBefore} iconAfter={iconAfter} label={child.props.children} />,
              )
            : child}
        </Slot>
      );
    } else if (props.href !== undefined) {
      const { asChild: _asChild, ...rest } = props as SidebarItemAsAnchor;
      row = (
        <a ref={ref as Ref<HTMLAnchorElement>} {...rest} {...shared}>
          <RowContent iconBefore={iconBefore} iconAfter={iconAfter} label={children} />
        </a>
      );
    } else {
      const { asChild: _asChild, type, ...rest } = props as SidebarItemAsButton;
      row = (
        <button ref={ref as Ref<HTMLButtonElement>} type={type ?? "button"} {...rest} {...shared}>
          <RowContent iconBefore={iconBefore} iconAfter={iconAfter} label={children} />
        </button>
      );
    }

    return (
      <li className={styles.listItem}>
        {row}
        {nestedItems != null && !nested && (
          <ul className={styles.list}>
            <Nested.Provider value={true}>{nestedItems}</Nested.Provider>
          </ul>
        )}
      </li>
    );
  },
);
