import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { ChevronRightIcon, ChevronUpIcon } from "../Icon";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "primary", "secondary"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    disabled: { control: "boolean" },
  },
  args: { children: "Send", variant: "default", size: "md" },
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

export const Sizes: Story = {
  render: (args) => (
    <Row>
      <Button {...args} variant="primary" size="sm">Small</Button>
      <Button {...args} variant="primary" size="md">Medium</Button>
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

export const WithIcon: Story = {
  render: (args) => (
    <Row>
      <Button {...args} variant="primary" size="sm">Continue <ChevronRightIcon /></Button>
      <Button {...args} variant="primary" size="md">Continue <ChevronRightIcon /></Button>
      <Button {...args} variant="secondary" size="md"><ChevronUpIcon /> Back to top</Button>
    </Row>
  ),
};

/** `asChild` renders the child element with Button's styling — a link that looks like a button. */
export const AsLink: Story = {
  render: (args) => (
    <Row>
      <Button {...args} asChild variant="secondary">
        <a href="https://www.radix-ui.com" target="_blank" rel="noreferrer">Open Radix docs</a>
      </Button>
    </Row>
  ),
};

/**
 * Reproduces the "Send" button from the Figma portfolio frame (node 196:66):
 * knockout background, pill radius, Label/Medium, 40px tall.
 *
 * This story is the tripwire for drift between Figma and code. If the Figma
 * binding changes, this is what should start looking wrong first.
 */
export const FigmaParity: Story = {
  name: "Figma parity — Send",
  render: () => (
    <div style={{ display: "flex", gap: "0", alignItems: "center" }}>
      <Button variant="primary" size="md">Send</Button>
    </div>
  ),
};
