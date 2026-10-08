import { forwardRef, useId } from "react";
import type { ReactNode } from "react";
import * as Label from "@radix-ui/react-label";
import { cx } from "../../cx";
import { Input } from "../Input";
import type { InputProps } from "../Input";
import styles from "./TextField.module.css";

/* Label + Input + message, as the Figma Text field. Radix Label handles the
   label's association and its click-to-focus; the rest is wiring IDs so the
   message is announced with the input. */

export interface TextFieldProps extends InputProps {
  /** Shown above the input and used as its accessible name. Without one,
   *  pass `aria-label`. */
  label?: ReactNode;
  /** Helper text below the input, in content/subtle. */
  description?: ReactNode;
  /** Error text below the input. Setting it also marks the input invalid,
   *  and it replaces `description` while present. */
  error?: ReactNode;
  /** Applies to the wrapper; every other prop goes to the `<input>`. */
  className?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, description, error, invalid, disabled, className, id, "aria-describedby": describedBy, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const isInvalid = invalid || Boolean(error);
  const message = error || description;

  return (
    <div className={cx(styles.field, className)} data-disabled={disabled ? "" : undefined}>
      {label && (
        <Label.Root htmlFor={inputId} className={styles.label}>
          {label}
        </Label.Root>
      )}
      <Input
        ref={ref}
        id={inputId}
        disabled={disabled}
        invalid={isInvalid}
        aria-describedby={cx(message ? messageId : undefined, describedBy) || undefined}
        {...props}
      />
      {message && (
        <p id={messageId} className={cx(styles.message, error ? styles.error : undefined)}>
          {message}
        </p>
      )}
    </div>
  );
});
