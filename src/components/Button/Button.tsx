import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import styles from "./Button.module.css";

export type ButtonVariant = "default" | "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. Mirrors the three variants defined in the Figma tokens. */
  variant?: ButtonVariant;
  /** Control height, from `--sds-button-size-height-*`. */
  size?: ButtonSize;
  /**
   * Render the child element instead of a `<button>`, keeping these styles.
   * Use for links that should look like buttons:
   * `<Button asChild><a href="/x">Go</a></Button>`
   */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", size = "md", asChild = false, className, type, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={[styles.base, styles[variant], styles[size], className].filter(Boolean).join(" ")}
      // Buttons inside a form default to type="submit", which surprises people.
      // Only set it when actually rendering a <button>.
      {...(asChild ? {} : { type: type ?? "button" })}
      {...props}
    />
  );
});
