import { forwardRef, useId } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../cx";
import { CloseIcon } from "../Icon";
import styles from "./Chip.module.css";

/* A compact label for a value that has been chosen: the entries of a
   multiple Select, but not tied to it. Static unless `onRemove` is given,
   which adds a remove button — the chip itself is never interactive, so there
   is nothing to nest inside a field. */

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The chip's text. */
  children: ReactNode;
  /** Adds a remove button after the label. */
  onRemove?: () => void;
  /** Prefix of the remove button's accessible name, which reads
   *  "{removeLabel} {label}". Defaults to "Remove". Translate it, not the
   *  label. */
  removeLabel?: string;
  /** Greys the chip and disables its remove button. */
  disabled?: boolean;
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { children, onRemove, removeLabel = "Remove", disabled, className, ...props },
  ref,
) {
  const id = useId();
  const labelId = `${id}-label`;
  const buttonId = `${id}-remove`;

  return (
    <span ref={ref} className={cx(styles.chip, className)} data-disabled={disabled ? "" : undefined} {...props}>
      <span id={labelId} className={styles.label}>
        {children}
      </span>
      {onRemove && (
        <button
          id={buttonId}
          type="button"
          className={styles.remove}
          disabled={disabled}
          onClick={onRemove}
          // "Remove" + the chip's own label, so a row of chips doesn't read as
          // a row of identical "Remove" buttons.
          aria-label={removeLabel}
          aria-labelledby={`${buttonId} ${labelId}`}
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
});
