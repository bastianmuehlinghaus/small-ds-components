import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";
import { cx } from "../../cx";
import styles from "./Accordion.module.css";

/* Radix owns the behaviour here — roving focus, Home/End, ARIA wiring and the
   content measurement that makes a height transition possible. This file is
   appearance only. */

export type AccordionRootProps = ComponentPropsWithoutRef<typeof RadixAccordion.Root>;

export const AccordionRoot = forwardRef<
  ComponentRef<typeof RadixAccordion.Root>,
  AccordionRootProps
>(function AccordionRoot({ className, ...props }, ref) {
  return <RadixAccordion.Root ref={ref} className={cx(styles.root, className)} {...props} />;
});

export type AccordionItemProps = ComponentPropsWithoutRef<typeof RadixAccordion.Item>;

export const AccordionItem = forwardRef<
  ComponentRef<typeof RadixAccordion.Item>,
  AccordionItemProps
>(function AccordionItem({ className, ...props }, ref) {
  return <RadixAccordion.Item ref={ref} className={cx(styles.item, className)} {...props} />;
});

const ChevronIcon = () => (
  <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export type AccordionTriggerProps = ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>;

/**
 * Wraps Radix's Header for you, because a Trigger outside a Header produces
 * invalid heading semantics and is easy to forget.
 */
export const AccordionTrigger = forwardRef<
  ComponentRef<typeof RadixAccordion.Trigger>,
  AccordionTriggerProps
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <RadixAccordion.Header className={styles.header}>
      <RadixAccordion.Trigger ref={ref} className={cx(styles.trigger, className)} {...props}>
        {children}
        <ChevronIcon />
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
});

export type AccordionContentProps = ComponentPropsWithoutRef<typeof RadixAccordion.Content>;

export const AccordionContent = forwardRef<
  ComponentRef<typeof RadixAccordion.Content>,
  AccordionContentProps
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <RadixAccordion.Content ref={ref} className={cx(styles.content, className)} {...props}>
      {/* Padding lives on an inner element: the animated element's height is
          driven by Radix and must not also carry box spacing. */}
      <div className={styles.contentInner}>{children}</div>
    </RadixAccordion.Content>
  );
});

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};
