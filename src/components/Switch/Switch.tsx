import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ComponentRef, ReactNode } from "react";
import * as Radix from "@radix-ui/react-switch";
import { cx } from "../../cx";
import styles from "../SelectionControl/SelectionControl.module.css";

/* Radix owns behaviour: the switch role and aria-checked, Space and Enter to
   toggle, controlled and uncontrolled state, and a hidden native input so the
   value still submits with a form. This file is appearance only. */

export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<typeof Radix.Root>, "children"> {
  /**
   * The label. Without one, the bare control renders, and it then needs an
   * `aria-label` or `aria-labelledby`.
   */
  children?: ReactNode;
}

export const Switch = forwardRef<ComponentRef<typeof Radix.Root>, SwitchProps>(
  function Switch({ className, children, disabled, ...props }, ref) {
    const control = (
      <Radix.Root
        ref={ref}
        disabled={disabled}
        className={cx(styles.control, styles.switch, styles.interactive, !children && className)}
        {...props}
      >
        <span className={styles.track}>
          <Radix.Thumb className={styles.thumb} />
        </span>
      </Radix.Root>
    );

    if (!children) return control;

    // As on Checkbox: a wrapping <label> names the button and makes the text a
    // hit target, so a click on it toggles the switch.
    return (
      <label className={cx(styles.field, className)} data-disabled={disabled ? "" : undefined}>
        {control}
        <span className={styles.text}>{children}</span>
      </label>
    );
  },
);
