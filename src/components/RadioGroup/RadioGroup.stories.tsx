import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup.Root,
  parameters: { layout: "padded" },
  args: { defaultValue: "light", "aria-label": "Mode" },
} satisfies Meta<typeof RadioGroup.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = (
  <>
    <RadioGroup.Item value="light">Light</RadioGroup.Item>
    <RadioGroup.Item value="dark">Dark</RadioGroup.Item>
    <RadioGroup.Item value="system">System</RadioGroup.Item>
  </>
);

/** Arrow keys move the selection; Tab leaves the group. */
export const Default: Story = {
  render: (args) => <RadioGroup.Root {...args}>{options}</RadioGroup.Root>,
};

export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => <RadioGroup.Root {...args}>{options}</RadioGroup.Root>,
};

export const DisabledItem: Story = {
  render: (args) => (
    <RadioGroup.Root {...args}>
      <RadioGroup.Item value="light">Light</RadioGroup.Item>
      <RadioGroup.Item value="dark">Dark</RadioGroup.Item>
      <RadioGroup.Item value="system" disabled>
        System
      </RadioGroup.Item>
    </RadioGroup.Root>
  ),
};

export const DisabledGroup: Story = {
  args: { disabled: true },
  render: (args) => <RadioGroup.Root {...args}>{options}</RadioGroup.Root>,
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: undefined },
  render: (args) => <RadioGroup.Root {...args}>{options}</RadioGroup.Root>,
};
