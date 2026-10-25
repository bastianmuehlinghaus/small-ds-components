import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Button } from "./Button";
import { ChevronRightIcon, ChevronUpIcon, CloseIcon, ComposeIcon, SearchIcon } from "../Icon";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "primary", "secondary", "subtle"] },
    iconOnly: { control: false },
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
      <Button {...args} variant="subtle">Subtle</Button>
    </Row>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Row>
      <Button {...args} variant="primary" disabled>Primary</Button>
      <Button {...args} variant="default" disabled>Default</Button>
      <Button {...args} variant="secondary" disabled>Secondary</Button>
      <Button {...args} variant="subtle" disabled>Subtle</Button>
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

/** `iconOnly` makes a square of the one control size, with the icon centred
 *  and no label, so `aria-label` is required. Every variant has one; `subtle`
 *  is the usual pick, in a toolbar, a header or a message. */
export const IconOnly: Story = {
  render: () => (
    <Row>
      <Button variant="primary" iconOnly aria-label="New issue"><ComposeIcon /></Button>
      <Button variant="default" iconOnly aria-label="Search"><SearchIcon /></Button>
      <Button variant="secondary" iconOnly aria-label="Search"><SearchIcon /></Button>
      <Button variant="subtle" iconOnly aria-label="Close"><CloseIcon /></Button>
      <Button variant="subtle" iconOnly aria-label="Close" disabled><CloseIcon /></Button>
    </Row>
  ),
};

/** Square at the button's height in every variant, a secondary's border
 *  included, with the icon in the middle. */
export const IconOnlyIsSquare: Story = {
  tags: ["!autodocs", "test"],
  render: () => (
    <Row>
      <Button variant="default" iconOnly aria-label="Search"><SearchIcon /></Button>
      <Button variant="secondary" iconOnly aria-label="Search"><SearchIcon /></Button>
      <Button variant="subtle" iconOnly aria-label="Search"><SearchIcon /></Button>
    </Row>
  ),
  play: async ({ canvas }) => {
    for (const button of canvas.getAllByRole("button", { name: "Search" })) {
      await expect([button.offsetWidth, button.offsetHeight]).toEqual([32, 32]);
      const box = button.getBoundingClientRect();
      const icon = button.querySelector("svg")!.getBoundingClientRect();
      await expect(icon.left - box.left).toBeCloseTo(box.right - icon.right, 1);
    }
  },
};

/** `subtle` draws no fill until hovered or pressed, so it takes on the
 *  surface it sits on. */
export const SubtleHasNoFill: Story = {
  tags: ["!autodocs", "test"],
  render: () => <Button variant="subtle">Subtle</Button>,
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByRole("button"));
    await expect(style.backgroundColor).toBe("rgba(0, 0, 0, 0)");
    await expect(style.borderLeftStyle).toBe("none");
  },
};
