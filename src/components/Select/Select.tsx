import { forwardRef, useCallback, useId, useRef, useState } from "react";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { Select as Base } from "@base-ui/react/select";
import { cx } from "../../cx";
import { tokenPx } from "../../tokenPx";
import { Chip } from "../Chip";
import { CheckmarkIcon, ChevronDownIcon } from "../Icon";
import selection from "../SelectionControl/SelectionControl.module.css";
import styles from "./Select.module.css";

/* A select on Base UI's Select, which renders a real listbox: the trigger is a
   combobox, the rows are options, and `multiple` adds aria-multiselectable.
   That is the pattern assistive technology expects of a select field, and why
   this is not built on DropdownMenu, a menu being for actions and settings.
   The rows borrow the menu's look: its row styles and the Checkbox / Radio
   box, so a Select and a DropdownMenu with selection rows match.

   Single: the trigger is the box and holds the value, so it is the combobox's
   text. Multiple: chips cannot live inside a button, so the trigger is a layer
   under the content and fills the field. The chips sit above it and let clicks
   through, except each chip's remove button. The trigger still carries the
   chosen labels as text, which the layer hides by colour only, so a screen
   reader reads the value there and the chips are a second route to it. */

export interface SelectOption {
  value: string;
  /** Shown in the list, in the trigger, and in the chip. */
  label: ReactNode;
  disabled?: boolean;
}

interface SelectBaseProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "value" | "defaultValue" | "onChange" | "children" | "size"
  > {
  options: SelectOption[];
  /** Shown while nothing is chosen, in `--sds-select-color-content-placeholder`. */
  placeholder?: string;
  /** Error state. Sets `aria-invalid`, which also draws the error border. */
  invalid?: boolean;
  /** Submits with a form, one hidden input per chosen value. */
  name?: string;
  /** Prefix of each chip's remove button name ("Remove Light"). Multiple only. */
  removeLabel?: string;
  /** Opens the list on first render. For stories and screenshots; the list is
   *  uncontrolled otherwise. */
  defaultOpen?: boolean;
  /** Where the list renders. Defaults to `document.body`. Inside a modal
   *  layer such as a Radix Dialog, pass that layer's content element: the
   *  Dialog makes everything outside it unclickable. */
  portalContainer?: HTMLElement | null;
}

interface SelectSingleProps {
  /** One choice, shown as radio rows. */
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface SelectMultipleProps {
  /** Several choices, shown as checkbox rows and as chips in the field. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type SelectProps = SelectBaseProps & (SelectSingleProps | SelectMultipleProps);

/* The gap between the field and its list, the same as a menu's from its trigger.
   Base UI takes it as a number, so it is read from the token, not from CSS. */
const LIST_OFFSET = tokenPx("sds-space-inline-xs");

const toArray = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

function setRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as { current: T | null }).current = node;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(props, ref) {
  const {
    options,
    placeholder,
    invalid,
    name,
    removeLabel,
    portalContainer,
    defaultOpen,
    multiple,
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled,
    className,
    id,
    ...buttonProps
  } = props;

  const autoId = useId();
  const triggerId = id ?? autoId;
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Controlled when `value` is passed, uncontrolled otherwise. Held as an
  // array in both modes, since the chips need it; a single choice is an array
  // of one. Base UI is always given the value, so it never holds its own.
  const [inner, setInner] = useState<string[]>(() => toArray(defaultValue));
  const selected = valueProp === undefined ? inner : toArray(valueProp);

  const commit = useCallback(
    (next: string[]) => {
      setInner(next);
      // The overloads of the discriminated union don't survive destructuring.
      (onValueChange as ((value: string | string[]) => void) | undefined)?.(
        multiple ? next : (next[0] ?? ""),
      );
    },
    [multiple, onValueChange],
  );

  const labelOf = (value: string) => options.find((option) => option.value === value)?.label ?? value;

  const remove = (value: string) => {
    commit(selected.filter((item) => item !== value));
    // The chip is about to unmount, and the focus would go with it.
    triggerRef.current?.focus();
  };

  const hasValue = selected.length > 0;

  const trigger = (children: ReactNode) => (
    <Base.Trigger
      ref={(node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        setRef(ref, node);
      }}
      className={cx(styles.trigger, !multiple && styles.single)}
      aria-invalid={invalid || undefined}
      {...buttonProps}
    >
      {children}
    </Base.Trigger>
  );

  const list = (
    <Base.Portal container={portalContainer}>
      {/* Base UI aligns the list over the trigger, like a native select, unless
          told not to. The list sits below the field, as the menu does. */}
      <Base.Positioner alignItemWithTrigger={false} align="start" sideOffset={LIST_OFFSET} className={styles.positioner}>
        <Base.Popup className={styles.popup}>
          <Base.List className={styles.list}>
            {options.map((option) => (
              <Base.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={styles.item}
                // The selection box reads the row's state, as in DropdownMenu.
                data-state={selected.includes(option.value) ? "checked" : "unchecked"}
              >
                <span className={cx(selection.control, multiple ? selection.checkbox : selection.radio)} aria-hidden="true">
                  <span className={selection.box}>
                    <Base.ItemIndicator className={multiple ? selection.mark : selection.dot}>
                      {multiple && <CheckmarkIcon />}
                    </Base.ItemIndicator>
                  </span>
                </span>
                <Base.ItemText>{option.label}</Base.ItemText>
              </Base.Item>
            ))}
          </Base.List>
        </Base.Popup>
      </Base.Positioner>
    </Base.Portal>
  );

  // Base UI's own value is null when nothing is chosen, an array in multiple.
  const root = (children: ReactNode) =>
    multiple ? (
      <Base.Root<string, true>
        multiple
        defaultOpen={defaultOpen}
        items={options}
        id={triggerId}
        name={name}
        disabled={disabled}
        value={selected}
        onValueChange={(next) => commit(next)}
      >
        {children}
      </Base.Root>
    ) : (
      <Base.Root<string>
        defaultOpen={defaultOpen}
        items={options}
        id={triggerId}
        name={name}
        disabled={disabled}
        value={selected[0] ?? null}
        onValueChange={(next) => commit(next === null ? [] : [next])}
      >
        {children}
      </Base.Root>
    );

  if (!multiple) {
    return (
      <div className={cx(styles.field, className)} data-disabled={disabled ? "" : undefined}>
        {root(
          <>
            {trigger(
              <>
                <Base.Value className={styles.value} placeholder={placeholder} />
                <Base.Icon className={styles.chevron}>
                  <ChevronDownIcon />
                </Base.Icon>
              </>,
            )}
            {list}
          </>,
        )}
      </div>
    );
  }

  return (
    <div
      className={cx(styles.field, styles.multiple, className)}
      data-disabled={disabled ? "" : undefined}
    >
      {root(
        <>
          {trigger(
            // The chosen labels as text, hidden by colour (not removed), so a
            // screen reader reads the value from the combobox itself.
            <Base.Value className={styles.hiddenValue} placeholder={placeholder}>
              {() =>
                hasValue
                  ? selected.flatMap((value, index) => (index ? [", ", labelOf(value)] : [labelOf(value)]))
                  : placeholder
              }
            </Base.Value>,
          )}

          {/* Above the trigger layer, so the layer is the click target for
              everything except the remove buttons. */}
          <div className={styles.content}>
            {hasValue ? (
              selected.map((value) => (
                <Chip key={value} disabled={disabled} removeLabel={removeLabel} onRemove={() => remove(value)}>
                  {labelOf(value)}
                </Chip>
              ))
            ) : (
              <span className={styles.placeholder}>{placeholder}</span>
            )}
          </div>
          <ChevronDownIcon className={styles.chevron} />
          {list}
        </>,
      )}
    </div>
  );
});
