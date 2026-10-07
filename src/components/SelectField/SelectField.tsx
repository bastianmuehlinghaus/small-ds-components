import { forwardRef, useId } from "react";
import type { ReactNode } from "react";
import * as Label from "@radix-ui/react-label";
import { cx } from "../../cx";
import { Select } from "../Select";
import type { SelectProps } from "../Select";
import styles from "../TextField/TextField.module.css";

/* Label + Select + message, the same arrangement as TextField, and it shares
   TextField's stylesheet: the label, message and error are the same three
   rules, so there is one place to change them. */

type SelectFieldOwnProps = {
  /** Shown above the select and used as its accessible name. Without one,
   *  pass `aria-label`. */
  label?: ReactNode;
  /** Helper text below the select, in content/subtle. */
  description?: ReactNode;
  /** Error text below the select. Setting it also marks the select invalid,
   *  and it replaces `description` while present. */
  error?: ReactNode;
};

export type SelectFieldProps = SelectFieldOwnProps & SelectProps;

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(function SelectField(
  props,
  ref,
) {
  const { label, description, error, invalid, disabled, id, "aria-describedby": describedBy, ...selectProps } =
    props;
  const autoId = useId();
  const triggerId = id ?? autoId;
  const labelId = `${triggerId}-label`;
  const messageId = `${triggerId}-message`;
  const message = error || description;

  return (
    <div className={styles.field} data-disabled={disabled ? "" : undefined}>
      {label && (
        <Label.Root id={labelId} htmlFor={triggerId} className={styles.label}>
          {label}
        </Label.Root>
      )}
      <Select
        ref={ref}
        id={triggerId}
        disabled={disabled}
        invalid={invalid || Boolean(error)}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={cx(message ? messageId : undefined, describedBy) || undefined}
        {...(selectProps as SelectProps)}
      />
      {message && (
        <p id={messageId} className={cx(styles.message, error ? styles.error : undefined)}>
          {message}
        </p>
      )}
    </div>
  );
});
