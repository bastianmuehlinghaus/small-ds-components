import { Children, cloneElement, createContext, forwardRef, isValidElement, useContext } from "react";
import type { ComponentPropsWithoutRef, ComponentRef, ReactElement, ReactNode } from "react";
import * as Radix from "@radix-ui/react-navigation-menu";
import { cx } from "../../cx";
import { ChevronDownIcon } from "../Icon";
import styles from "./NavigationMenu.module.css";

/* Radix owns behaviour: opening on hover and on click, the delay between
   triggers, arrow keys along the bar and into a panel, Escape, outside-press
   dismissal and aria-current. This file is appearance only.

   There is no Radix Viewport and no Indicator: each panel opens under its own
   trigger, start-aligned, on the Dropdown menu's surface (issue #104). Without
   a Viewport, Radix renders the Content inside its Item, so the panel is
   positioned by CSS against the Item rather than by a positioning library. */

/** A Link inside a Content is a panel row; outside one it is a bar link. */
const InPanel = createContext(false);

export type NavigationMenuRootProps = ComponentPropsWithoutRef<typeof Radix.Root>;

export const NavigationMenuRoot = forwardRef<
  ComponentRef<typeof Radix.Root>,
  NavigationMenuRootProps
>(function NavigationMenuRoot({ className, ...props }, ref) {
  return <Radix.Root ref={ref} className={cx(styles.root, className)} {...props} />;
});

export type NavigationMenuListProps = ComponentPropsWithoutRef<typeof Radix.List>;

export const NavigationMenuList = forwardRef<
  ComponentRef<typeof Radix.List>,
  NavigationMenuListProps
>(function NavigationMenuList({ className, ...props }, ref) {
  return <Radix.List ref={ref} className={cx(styles.list, className)} {...props} />;
});

export type NavigationMenuItemProps = ComponentPropsWithoutRef<typeof Radix.Item>;

export const NavigationMenuItem = forwardRef<
  ComponentRef<typeof Radix.Item>,
  NavigationMenuItemProps
>(function NavigationMenuItem({ className, ...props }, ref) {
  return <Radix.Item ref={ref} className={cx(styles.item, className)} {...props} />;
});

export type NavigationMenuTriggerProps = ComponentPropsWithoutRef<typeof Radix.Trigger>;

export const NavigationMenuTrigger = forwardRef<
  ComponentRef<typeof Radix.Trigger>,
  NavigationMenuTriggerProps
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <Radix.Trigger ref={ref} className={cx(styles.control, styles.trigger, className)} {...props}>
      {children}
      <ChevronDownIcon className={styles.chevron} />
    </Radix.Trigger>
  );
});

export type NavigationMenuContentProps = ComponentPropsWithoutRef<typeof Radix.Content>;

export const NavigationMenuContent = forwardRef<
  ComponentRef<typeof Radix.Content>,
  NavigationMenuContentProps
>(function NavigationMenuContent({ className, children, ...props }, ref) {
  return (
    // The Content is a transparent wrapper whose top padding is the gap to the
    // trigger, so the pointer never crosses dead space on its way into the
    // panel. The surface is drawn inside it.
    <Radix.Content ref={ref} className={cx(styles.content, className)} {...props}>
      <div className={styles.surface}>
        <ul className={styles.panelList}>
          <InPanel.Provider value={true}>{children}</InPanel.Provider>
        </ul>
      </div>
    </Radix.Content>
  );
});

export type NavigationMenuLinkProps = ComponentPropsWithoutRef<typeof Radix.Link> & {
  /** A line under the label, in panel rows only. A bar link ignores it. */
  description?: ReactNode;
};

/** The row's text, in their own boxes: a label that truncates, and the description under it. */
function RowText({ label, description }: { label: ReactNode; description?: ReactNode }) {
  return (
    <>
      <span className={styles.rowLabel}>{label}</span>
      {description != null && <span className={styles.rowDescription}>{description}</span>}
    </>
  );
}

export const NavigationMenuLink = forwardRef<
  ComponentRef<typeof Radix.Link>,
  NavigationMenuLinkProps
>(function NavigationMenuLink({ className, children, description, asChild, ...props }, ref) {
  const inPanel = useContext(InPanel);

  if (!inPanel) {
    return (
      <Radix.Link
        ref={ref}
        className={cx(styles.control, className)}
        asChild={asChild}
        {...props}
      >
        {children}
      </Radix.Link>
    );
  }

  // With asChild the consumer's element (a router link) becomes the row, so
  // the label and description go inside it rather than inside an <a> of ours.
  const row = asChild
    ? (() => {
        const child = Children.only(children) as ReactElement<{ children?: ReactNode }>;
        return isValidElement(child)
          ? cloneElement(child, undefined, <RowText label={child.props.children} description={description} />)
          : child;
      })()
    : <RowText label={children} description={description} />;

  return (
    <li className={styles.panelItem}>
      <Radix.Link ref={ref} className={cx(styles.row, className)} asChild={asChild} {...props}>
        {row}
      </Radix.Link>
    </li>
  );
});

export const NavigationMenu = {
  Root: NavigationMenuRoot,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
};
