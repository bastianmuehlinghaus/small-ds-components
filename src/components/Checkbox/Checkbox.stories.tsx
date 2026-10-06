import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";
import type { CheckboxCheckedState } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: { layout: "padded" },
  args: { children: "Show primitives" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [checked, setChecked] = useState<CheckboxCheckedState>(true);
    return (
      <Checkbox {...args} checked={checked} onCheckedChange={setChecked}>
        Show primitives ({String(checked)})
      </Checkbox>
    );
  },
};

/** The Figma matrix: Checked (False, True, Indeterminate) × State. Hover and Focus are live — point at or
 *  Tab to any control. */
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, max-content)", gap: "var(--sds-space-stack-md) var(--sds-space-inline-lg)" }}>
      <Checkbox>Default</Checkbox>
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox invalid>Invalid</Checkbox>
      <Checkbox defaultChecked>Default</Checkbox>
      <Checkbox defaultChecked disabled>Disabled</Checkbox>
      <Checkbox defaultChecked invalid>Invalid</Checkbox>
      <Checkbox defaultChecked="indeterminate">Default</Checkbox>
      <Checkbox defaultChecked="indeterminate" disabled>Disabled</Checkbox>
      <Checkbox defaultChecked="indeterminate" invalid>Invalid</Checkbox>
    </div>
  ),
};

/** Indeterminate's usual job: a parent that is partly selected. Clicking it
 *  from indeterminate selects all, as Radix toggles "indeterminate" → true. */
export const SelectAll: Story = {
  render: function SelectAllStory() {
    const [tiers, setTiers] = useState({ primitives: true, semantics: false, components: true });
    const values = Object.values(tiers);
    const all: CheckboxCheckedState = values.every(Boolean)
      ? true
      : values.some(Boolean)
        ? "indeterminate"
        : false;
    const setAll = (next: CheckboxCheckedState) =>
      setTiers({ primitives: next === true, semantics: next === true, components: next === true });
    return (
      <div style={{ display: "grid", gap: "var(--sds-space-stack-xs)" }}>
        <Checkbox checked={all} onCheckedChange={setAll}>
          All tiers
        </Checkbox>
        <div style={{ display: "grid", gap: "var(--sds-space-stack-xs)", paddingInlineStart: "var(--sds-space-inset-xl)" }}>
          {(Object.keys(tiers) as Array<keyof typeof tiers>).map((key) => (
            <Checkbox
              key={key}
              checked={tiers[key]}
              onCheckedChange={(next) => setTiers({ ...tiers, [key]: next === true })}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Checkbox>
          ))}
        </div>
      </div>
    );
  },
};

/** A wrapping label hangs from the control: the box centres on the first line,
 *  not on the paragraph. */
export const LongLabel: Story = {
  render: () => (
    <div style={{ maxWidth: "18rem" }}>
      <Checkbox defaultChecked>
        Include deprecated tokens in the export, alongside their replacements
      </Checkbox>
    </div>
  ),
};

/** Without a label the bare 24px control renders, and needs an accessible name. */
export const WithoutLabel: Story = {
  args: { children: undefined, "aria-label": "Select row" },
};
