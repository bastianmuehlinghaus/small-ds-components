import { Children, forwardRef, Fragment, isValidElement, useId } from "react";
import type { ComponentType, HTMLAttributes, ReactElement, ReactNode } from "react";
import { cx } from "../../cx";
import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "../Icon";
import type { IconProps } from "../Icon";
import { Link } from "../Link";
import type { LinkProps } from "../Link";
import styles from "./SectionMessage.module.css";

/* A message about one part of the page, in that part of the page, following
   Atlassian's section message: an icon, an optional title, the message, and
   optional actions as links separated by dots. Static. It is not a live
   region, because it is on the page when the page renders; something that
   appears later to announce itself (a toast, a banner) is a different
   component. `onDismiss` adds a dismiss button, as Chip's `onRemove` adds a
   remove button: the consumer unmounts the message. */

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
  /** Adds a dismiss button at the end. Remove the message in it, and move
   *  focus somewhere sensible, since the focused button goes with it. */
  onDismiss?: () => void;
  /** Prefix of the dismiss button's accessible name, which reads
   *  "{dismissLabel} {title}". Defaults to "Dismiss". Translate it. */
  dismissLabel?: string;
  /** The message. Text, or paragraphs: block children are stacked with the
   *  same gap as the title, and lose their own margins. */
  children?: ReactNode;
}

export const SectionMessage = forwardRef<HTMLElement, SectionMessageProps>(function SectionMessage(
  {
    appearance = "info",
    title,
    headingLevel: Heading = "h2",
    actions,
    iconLabel,
    onDismiss,
    dismissLabel = "Dismiss",
    children,
    className,
    ...props
  },
  ref,
) {
  const id = useId();
  const titleId = `${id}-title`;
  const dismissId = `${id}-dismiss`;
  const { Icon, label } = appearances[appearance];
  const hasTitle = title != null && title !== false && title !== "";

  // A fragment counts as its children, so `actions={<>…</>}` makes a list.
  const actionElements =
    isValidElement(actions) && actions.type === Fragment
      ? (actions as ReactElement<{ children?: ReactNode }>).props.children
      : actions;
  const actionList = Children.toArray(actionElements);
  const firstLine = hasTitle ? styles.besideTitle : styles.besideBody;

  return (
    <section ref={ref} className={cx(styles.message, styles[appearance], className)} {...props}>
      {/* The icon's box, and the dismiss button's, take the line height of
          whatever comes first, title or message, so both are centred on that
          line at any font size. */}
      <span className={cx(styles.edge, firstLine)}>
        <Icon className={styles.glyph} role="img" aria-hidden={false} aria-label={iconLabel ?? label} />
      </span>
      <div className={styles.content}>
        {hasTitle && (
          <Heading id={titleId} className={styles.title}>
            {title}
          </Heading>
        )}
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
      {onDismiss && (
        <span className={cx(styles.edge, firstLine)}>
          <button
            id={dismissId}
            type="button"
            className={styles.dismiss}
            onClick={onDismiss}
            // "Dismiss" + the title, so two messages don't offer two identical
            // "Dismiss" buttons.
            aria-label={dismissLabel}
            aria-labelledby={hasTitle ? `${dismissId} ${titleId}` : undefined}
          >
            <CloseIcon />
          </button>
        </span>
      )}
    </section>
  );
});

export type SectionMessageActionProps = LinkProps;

/**
 * An action in a Section message: a `Link`, so an `<a>` with `href` and a
 * button without. A link, not a filled Button, because the message's tinted
 * background is not a place for one.
 */
export const SectionMessageAction = Link;
