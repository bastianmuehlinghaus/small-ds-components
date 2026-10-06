import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ComponentRef, ReactNode } from "react";
import * as Radix from "@radix-ui/react-checkbox";
import { cx } from "../../cx";
import { CheckmarkIcon, DashIcon } from "../Icon";
import styles from "../SelectionControl/SelectionControl.module.css";

/* Radix owns behaviour: the checkbox role, Space to toggle, controlled and
   uncontrolled state, aria-checked="mixed" for indeterminate, and a hidden
   native input so the value still submits with a form. This file is
   appearance only. */

export type CheckboxCheckedState = Radix.CheckedState;

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<typeof Radix.Root>, "children"> {
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
    { className, children, invalid, disabled, ...props },
    ref,
  ) {
    const control = (
      <Radix.Root
        ref={ref}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cx(styles.control, styles.checkbox, styles.interactive, !children && className)}
        {...props}
      >
        <span className={styles.box}>
          {/* Both glyphs render; the Indicator's data-state picks one in CSS,
              so it also works uncontrolled, where React never sees the state.
              Indeterminate looks like checked, with the dash for the mark. */}
          <Radix.Indicator className={styles.mark}>
            <CheckmarkIcon className={styles.checkGlyph} />
            <DashIcon className={styles.dashGlyph} />
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
