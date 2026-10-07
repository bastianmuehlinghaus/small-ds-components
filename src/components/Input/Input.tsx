import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cx } from "../../cx";
import styles from "./Input.module.css";

/* A native <input>. Radix has no text-input primitive: the browser already
   provides the behaviour (typing, selection, autofill, form submission), so
   this file is appearance only, as with every other component here. */

export type InputSize = "sm" | "md";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Control height, from `--sds-input-size-height-*`. Replaces the native
   *  `size` attribute, which sets a width in characters. */
  size?: InputSize;
  /** Error state. Sets `aria-invalid`, which also draws the error border. */
  invalid?: boolean;
  /** Browser autofill and suggestions. Defaults to `"off"`, since a
   *  suggestion list nobody asked for reads as part of the field. Pass a
   *  token such as `"email"` or `"current-password"` where autofill is the
   *  point of the field. */
  autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", invalid, className, type = "text", autoComplete = "off", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      autoComplete={autoComplete}
      aria-invalid={invalid || undefined}
      className={cx(styles.input, styles[size], className)}
      {...props}
    />
  );
});
