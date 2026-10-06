import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import * as Radix from "@radix-ui/react-dropdown-menu";
import { cx } from "../../cx";
import { CheckmarkIcon, ChevronRightIcon, DashIcon } from "../Icon";
import selection from "../SelectionControl/SelectionControl.module.css";
import styles from "./DropdownMenu.module.css";

/* Radix owns behaviour: focus trapping, roving highlight, type-ahead,
   collision-aware positioning, Escape and outside-press dismissal. This file is
   appearance only. */

export type DropdownMenuContentProps = ComponentPropsWithoutRef<typeof Radix.Content>;

export const DropdownMenuContent = forwardRef<
  ComponentRef<typeof Radix.Content>,
  DropdownMenuContentProps
>(function DropdownMenuContent({ className, sideOffset = 4, align = "start", ...props }, ref) {
  return (
    <Radix.Portal>
      <Radix.Content
        ref={ref}
        sideOffset={sideOffset}
        // Radix defaults to "center". "start" shares the trigger's leading
        // edge, which puts the trigger label and the item labels on the same
        // vertical line — the button's 16px inset and the menu's 4px + 12px
        // happen to sum identically, so no token changes are needed.
        align={align}
        className={cx(styles.content, className)}
        {...props}
      />
    </Radix.Portal>
  );
});

export type DropdownMenuItemProps = ComponentPropsWithoutRef<typeof Radix.Item>;

export const DropdownMenuItem = forwardRef<
  ComponentRef<typeof Radix.Item>,
  DropdownMenuItemProps
>(function DropdownMenuItem({ className, ...props }, ref) {
  return <Radix.Item ref={ref} className={cx(styles.item, className)} {...props} />;
});

export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<typeof Radix.CheckboxItem>;

export const DropdownMenuCheckboxItem = forwardRef<
  ComponentRef<typeof Radix.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <Radix.CheckboxItem
      ref={ref}
      className={cx(styles.item, styles.selectionItem, className)}
      {...props}
    >
      {/* The Checkbox's box, not the Checkbox: the row is already the
          menuitemcheckbox, and a second control inside it would be a nested
          interactive element. The box reads the row's data-state. */}
      <span className={cx(selection.control, selection.checkbox)} aria-hidden="true">
        <span className={selection.box}>
          {/* As in Checkbox: both glyphs, and data-state picks one. */}
          <Radix.ItemIndicator className={selection.mark}>
            <CheckmarkIcon className={selection.checkGlyph} />
            <DashIcon className={selection.dashGlyph} />
          </Radix.ItemIndicator>
        </span>
      </span>
      {children}
    </Radix.CheckboxItem>
  );
});

export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<typeof Radix.RadioItem>;

export const DropdownMenuRadioItem = forwardRef<
  ComponentRef<typeof Radix.RadioItem>,
  DropdownMenuRadioItemProps
>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <Radix.RadioItem
      ref={ref}
      className={cx(styles.item, styles.selectionItem, className)}
      {...props}
    >
      <span className={cx(selection.control, selection.radio)} aria-hidden="true">
        <span className={selection.box}>
          <Radix.ItemIndicator className={selection.dot} />
        </span>
      </span>
      {children}
    </Radix.RadioItem>
  );
});

export type DropdownMenuLabelProps = ComponentPropsWithoutRef<typeof Radix.Label>;

export const DropdownMenuLabel = forwardRef<
  ComponentRef<typeof Radix.Label>,
  DropdownMenuLabelProps
>(function DropdownMenuLabel({ className, ...props }, ref) {
  return <Radix.Label ref={ref} className={cx(styles.label, className)} {...props} />;
});

export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<typeof Radix.Separator>;

export const DropdownMenuSeparator = forwardRef<
  ComponentRef<typeof Radix.Separator>,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return <Radix.Separator ref={ref} className={cx(styles.separator, className)} {...props} />;
});

export type DropdownMenuSubTriggerProps = ComponentPropsWithoutRef<typeof Radix.SubTrigger>;

export const DropdownMenuSubTrigger = forwardRef<
  ComponentRef<typeof Radix.SubTrigger>,
  DropdownMenuSubTriggerProps
>(function DropdownMenuSubTrigger({ className, children, ...props }, ref) {
  return (
    <Radix.SubTrigger ref={ref} className={cx(styles.subTrigger, className)} {...props}>
      {children}
      <ChevronRightIcon className={styles.subChevron} />
    </Radix.SubTrigger>
  );
});

export type DropdownMenuSubContentProps = ComponentPropsWithoutRef<typeof Radix.SubContent>;

export const DropdownMenuSubContent = forwardRef<
  ComponentRef<typeof Radix.SubContent>,
  DropdownMenuSubContentProps
>(function DropdownMenuSubContent({ className, sideOffset = 4, ...props }, ref) {
  return (
    <Radix.Portal>
      <Radix.SubContent
        ref={ref}
        sideOffset={sideOffset}
        className={cx(styles.subContent, className)}
        {...props}
      />
    </Radix.Portal>
  );
});

export const DropdownMenu = {
  Root: Radix.Root,
  Trigger: Radix.Trigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: Radix.RadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Group: Radix.Group,
  Sub: Radix.Sub,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
};
