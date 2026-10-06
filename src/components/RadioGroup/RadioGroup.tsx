import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ComponentRef, ReactNode } from "react";
import * as Radix from "@radix-ui/react-radio-group";
import { cx } from "../../cx";
import styles from "../SelectionControl/SelectionControl.module.css";

/* Radix owns behaviour: the radiogroup role, roving focus with arrow keys,
   one selected value, and a hidden native input per item for forms. This file
   is appearance only. */

export interface RadioGroupRootProps extends ComponentPropsWithoutRef<typeof Radix.Root> {
  /** Error state for the whole group. Sets `aria-invalid` and draws every
   *  item's border in the error colour. */
  invalid?: boolean;
}

export const RadioGroupRoot = forwardRef<ComponentRef<typeof Radix.Root>, RadioGroupRootProps>(
  function RadioGroupRoot({ className, invalid, ...props }, ref) {
    return (
      <Radix.Root
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cx(styles.group, className)}
        {...props}
      />
    );
  },
);

export interface RadioGroupItemProps
  extends Omit<ComponentPropsWithoutRef<typeof Radix.Item>, "children"> {
  /**
   * The label. Without one, the bare 24px control renders, and it then needs
   * an `aria-label` or `aria-labelledby`.
   */
  children?: ReactNode;
}

export const RadioGroupItem = forwardRef<ComponentRef<typeof Radix.Item>, RadioGroupItemProps>(
  function RadioGroupItem({ className, children, disabled, ...props }, ref) {
    const control = (
      <Radix.Item
        ref={ref}
        disabled={disabled}
        className={cx(styles.control, styles.radio, styles.interactive, !children && className)}
        {...props}
      >
        <span className={styles.box}>
          <Radix.Indicator className={styles.dot} />
        </span>
      </Radix.Item>
    );

    if (!children) return control;

    // `disabled` on the group reaches the item through Radix context, not this
    // prop, so the label also reads it back from the control via :has().
    return (
      <label className={cx(styles.field, className)} data-disabled={disabled ? "" : undefined}>
        {control}
        <span className={styles.text}>{children}</span>
      </label>
    );
  },
);

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
};
