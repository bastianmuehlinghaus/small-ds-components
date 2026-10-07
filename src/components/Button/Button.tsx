import { Children, cloneElement, forwardRef, isValidElement } from "react";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import styles from "./Button.module.css";

/** Text runs go into the label container that carries the label inset; icons
 *  and other elements stay direct children so they sit on the button's inset. */
function wrapLabels(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child !== "string" && typeof child !== "number") return child;
    const text = String(child).trim();
    return text ? <span className={styles.label}>{text}</span> : null;
  });
}

export type ButtonVariant = "default" | "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. Mirrors the three variants defined in the Figma tokens. */
  variant?: ButtonVariant;
  /**
   * Render the child element instead of a `<button>`, keeping these styles.
   * Use for links that should look like buttons:
   * `<Button asChild><a href="/x">Go</a></Button>`
   */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", asChild = false, className, type, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  // With asChild the label lives inside the slotted element (e.g. an <a>).
  const content =
    asChild && isValidElement(children)
      ? cloneElement(
          children as ReactElement<{ children?: ReactNode }>,
          undefined,
          wrapLabels((children as ReactElement<{ children?: ReactNode }>).props.children),
        )
      : wrapLabels(children);
  return (
    <Comp
      ref={ref}
      className={[styles.base, styles[variant], className].filter(Boolean).join(" ")}
      // Buttons inside a form default to type="submit", which surprises people.
      // Only set it when actually rendering a <button>.
      {...(asChild ? {} : { type: type ?? "button" })}
      {...props}
    >
      {content}
    </Comp>
  );
});
