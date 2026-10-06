import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ComponentRef, ReactNode } from "react";
import * as Radix from "@radix-ui/react-checkbox";
import { cx } from "../../cx";
import { CheckmarkIcon } from "../Icon";
import styles from "../SelectionControl/SelectionControl.module.css";

/* Radix owns behaviour: the checkbox role, Space to toggle, controlled and
   uncontrolled state, and a hidden native input so the value still submits
   with a form. This file is appearance only. */

type RadixRootProps = ComponentPropsWithoutRef<typeof Radix.Root>;

export interface CheckboxProps
  extends Omit<RadixRootProps, "checked" | "defaultChecked" | "onCheckedChange" | "children"> {
  /**
   * Controlled state. Indeterminate is not supported yet: Figma has no design
   * for it and there is no dash icon, so the type rules it out rather than
   * rendering an empty checked box.
   */
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Error state. Sets `aria-invalid`, which also draws the error border. */
  invalid?: boolean;
  /**
   * The label. Without one, the bare 24px control renders, and it then needs
   * an `aria-label` or `aria-labelledby`.
   */
  children?: ReactNode;
}

export const Checkbox = forwardRef<ComponentRef<typeof Radix.Root>, CheckboxProps>(
  function Checkbox(
    { className, children, invalid, onCheckedChange, disabled, ...props },
    ref,
  ) {
    const control = (
      <Radix.Root
        ref={ref}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onCheckedChange={onCheckedChange && ((state) => onCheckedChange(state === true))}
        className={cx(styles.control, styles.checkbox, styles.interactive, !children && className)}
        {...props}
      >
        <span className={styles.box}>
          <Radix.Indicator className={styles.mark}>
            <CheckmarkIcon />
          </Radix.Indicator>
        </span>
      </Radix.Root>
    );

    if (!children) return control;

    // A wrapping <label> names the button and makes the text a hit target:
    // a click on it activates the labelled control, which Radix toggles.
    return (
      <label className={cx(styles.field, className)} data-disabled={disabled ? "" : undefined}>
        {control}
        <span className={styles.text}>{children}</span>
      </label>
    );
  },
);
