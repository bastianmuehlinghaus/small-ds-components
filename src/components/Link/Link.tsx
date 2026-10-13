import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, Ref } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cx } from "../../cx";
import styles from "./Link.module.css";

/* A text link: underlined text in the link colour, in or after a sentence.
   Typography, not a control, so it takes the font of the text around it and
   has no padding and no height. One look, always underlined, so it never
   rests on colour alone (WCAG 1.4.1).

   What it renders follows what it does: an `<a>` with `href`, a
   `<button type="button">` without. A button that should look like a button
   is `Button`, and a link that should look like a button is
   `<Button asChild><a /></Button>`. */

type LinkAsAnchor = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; asChild?: false };
type LinkAsButton = ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; asChild?: false };
type LinkAsChild = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /**
   * Render the child element instead, keeping these styles. Use for a
   * router's link: `<Link asChild><RouterLink to="/x">Go</RouterLink></Link>`
   */
  asChild: true;
};

export type LinkProps = LinkAsAnchor | LinkAsButton | LinkAsChild;

export const Link = forwardRef<HTMLAnchorElement | HTMLButtonElement, LinkProps>(function Link(
  { className, asChild, ...props },
  ref,
) {
  const classes = cx(styles.link, className);
  if (asChild) {
    return <Slot ref={ref as Ref<HTMLAnchorElement>} className={classes} {...props} />;
  }
  if (props.href !== undefined) {
    return <a ref={ref as Ref<HTMLAnchorElement>} className={classes} {...(props as LinkAsAnchor)} />;
  }
  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      className={classes}
      {...(props as LinkAsButton)}
    />
  );
});
