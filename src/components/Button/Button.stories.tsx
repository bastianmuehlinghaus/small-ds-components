import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "primary", "secondary"] },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
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
      <Button {...args} variant="primary" size="lg">Large</Button>
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

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const WithIcon: Story = {
  render: (args) => (
    <Row>
      <Button {...args} variant="primary" size="sm">Continue <ArrowIcon /></Button>
      <Button {...args} variant="primary" size="md">Continue <ArrowIcon /></Button>
      <Button {...args} variant="primary" size="lg">Continue <ArrowIcon /></Button>
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
 * knockout background, pill radius, Label/Large, 40px tall.
 */
export const FigmaParity: Story = {
  name: "Figma parity — Send",
  render: () => (
    <div style={{ display: "flex", gap: "0", alignItems: "center" }}>
      <Button variant="primary" size="md">Send</Button>
    </div>
  ),
};
