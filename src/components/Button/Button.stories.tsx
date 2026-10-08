import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Button } from "./Button";
import { ChevronRightIcon, ChevronUpIcon } from "../Icon";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "primary", "secondary"] },
    disabled: { control: "boolean" },
  },
  args: { children: "Send", variant: "default" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
    {children}
  </div>
);

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Row>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="default">Default</Button>
      <Button {...args} variant="secondary">Secondary</Button>
    </Row>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Row>
      <Button {...args} variant="primary" disabled>Primary</Button>
      <Button {...args} variant="default" disabled>Default</Button>
      <Button {...args} variant="secondary" disabled>Secondary</Button>
    </Row>
  ),
};

/** A disabled button has no rank: a disabled secondary draws no border, so it
 *  looks like a disabled default. The border goes transparent rather than away,
 *  so the button is as wide disabled as enabled. */
export const DisabledSecondaryHasNoRank: Story = {
  tags: ["!autodocs", "test"],
  render: (args) => (
    <Row>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="secondary" disabled>Secondary</Button>
      <Button {...args} variant="default" disabled>Default</Button>
    </Row>
  ),
  play: async ({ canvas }) => {
    const [enabled, disabled, reference] = canvas.getAllByRole("button");
    if (!enabled || !disabled || !reference) throw new Error("expected three buttons");
    const style = getComputedStyle(disabled);
    const referenceStyle = getComputedStyle(reference);

    await expect(style.borderLeftColor).toBe("rgba(0, 0, 0, 0)");
    await expect(style.backgroundColor).toBe(referenceStyle.backgroundColor);
    await expect(style.color).toBe(referenceStyle.color);
    await expect(disabled.getBoundingClientRect().width).toBe(enabled.getBoundingClientRect().width);
  },
};

export const WithIcon: Story = {
  render: (args) => (
    <Row>
      <Button {...args} variant="primary">Continue <ChevronRightIcon /></Button>
      <Button {...args} variant="secondary"><ChevronUpIcon /> Back to top</Button>
    </Row>
  ),
};
