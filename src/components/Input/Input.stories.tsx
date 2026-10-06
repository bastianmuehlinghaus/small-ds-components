import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "padded" },
  args: { placeholder: "Search tokens", "aria-label": "Search tokens" },
  decorators: [(Story) => <div style={{ maxWidth: "15rem" }}><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-md)" }}>
      <Input {...args} size="sm" />
      <Input {...args} size="md" />
    </div>
  ),
};

/** The Figma matrix: Value (Placeholder, Filled) × State. Hover and Focus are
 *  live — point at or Tab to any input. Focus wins over Invalid. */
export const States: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-md)" }}>
      <Input {...args} />
      <Input {...args} defaultValue="color/border/focus" />
      <Input {...args} disabled />
      <Input {...args} disabled defaultValue="color/border/focus" />
      <Input {...args} invalid />
      <Input {...args} invalid defaultValue="color/border/focus" />
    </div>
  ),
};
