import { Children, forwardRef, Fragment, isValidElement } from "react";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentType,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { cx } from "../../cx";
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "../Icon";
import type { IconProps } from "../Icon";
import styles from "./SectionMessage.module.css";

/* A message about one part of the page, in that part of the page, following
   Atlassian's section message: an icon, an optional title, the message, and
   optional actions as links separated by dots. Static. It is not a live
   region, because it is on the page when the page renders; something that
   appears later to announce itself (a toast, a banner) is a different
   component. There is no dismiss button: a message that can be ignored
   probably should not be a section message. */

export type SectionMessageAppearance = "info" | "success" | "warning" | "error";

const appearances: Record<
  SectionMessageAppearance,
  { Icon: ComponentType<IconProps>; label: string }
> = {
  info: { Icon: InfoIcon, label: "Info" },
  success: { Icon: SuccessIcon, label: "Success" },
  warning: { Icon: WarningIcon, label: "Warning" },
  error: { Icon: ErrorIcon, label: "Error" },
};

export interface SectionMessageProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Sets the colour and the icon. Defaults to `"info"`. */
  appearance?: SectionMessageAppearance;
  /** A short heading above the message. */
  title?: ReactNode;
  /** The title's element, so it fits the page's outline. Defaults to `"h2"`. */
  headingLevel?: "h2" | "h3" | "h4" | "h5" | "h6";
  /** `SectionMessageAction`s, one or a fragment of several. Several become a
   *  list, separated by dots. */
  actions?: ReactNode;
  /** The icon's accessible name, read before the message. Defaults to the
   *  appearance in English ("Info", "Success", "Warning", "Error");
   *  translate it, since the colour alone does not carry the meaning. */
  iconLabel?: string;
  /** The message. Text, or paragraphs: block children are stacked with the
   *  same gap as the title, and lose their own margins. */
  children?: ReactNode;
}

export const SectionMessage = forwardRef<HTMLElement, SectionMessageProps>(function SectionMessage(
  { appearance = "info", title, headingLevel: Heading = "h2", actions, iconLabel, children, className, ...props },
  ref,
) {
  const { Icon, label } = appearances[appearance];
  const hasTitle = title != null && title !== false && title !== "";

  // A fragment counts as its children, so `actions={<>…</>}` makes a list.
  const actionElements =
    isValidElement(actions) && actions.type === Fragment
      ? (actions as ReactElement<{ children?: ReactNode }>).props.children
      : actions;
  const actionList = Children.toArray(actionElements);

  return (
    <section ref={ref} className={cx(styles.message, styles[appearance], className)} {...props}>
      {/* The icon's box takes the line height of whatever comes first, title
          or message, so the glyph is centred on that line at any font size. */}
      <span className={cx(styles.icon, hasTitle ? styles.iconBesideTitle : styles.iconBesideBody)}>
        <Icon className={styles.glyph} role="img" aria-hidden={false} aria-label={iconLabel ?? label} />
      </span>
      <div className={styles.content}>
        {hasTitle && <Heading className={styles.title}>{title}</Heading>}
        {children != null && <div className={styles.body}>{children}</div>}
        {actionList.length > 1 && (
          <ul className={styles.actions}>
            {actionList.map((action, i) => (
              <li key={i} className={styles.actionItem}>
                {action}
              </li>
            ))}
          </ul>
        )}
        {actionList.length === 1 && <div className={styles.actions}>{actionList[0]}</div>}
      </div>
    </section>
  );
});

type ActionAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ActionAsButton = ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export type SectionMessageActionProps = ActionAsLink | ActionAsButton;

/**
 * An action in a Section message: a link with `href`, a button without.
 * Both look like links, underlined in the link colour, because the message's
 * tinted background is not a place for a filled Button.
 */
export const SectionMessageAction = forwardRef<HTMLAnchorElement | HTMLButtonElement, SectionMessageActionProps>(
  function SectionMessageAction({ className, ...props }, ref) {
    if (props.href !== undefined) {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          className={cx(styles.action, className)}
          {...(props as ActionAsLink)}
        />
      );
    }
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        className={cx(styles.action, className)}
        {...(props as ActionAsButton)}
      />
    );
  },
);
