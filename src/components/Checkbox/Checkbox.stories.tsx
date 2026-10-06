import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

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
    const [checked, setChecked] = useState(true);
    return (
      <Checkbox {...args} checked={checked} onCheckedChange={setChecked}>
        Show primitives ({checked ? "on" : "off"})
      </Checkbox>
    );
  },
};

/** The Figma matrix: Checked × State. Hover and Focus are live — point at or
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
    </div>
  ),
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
