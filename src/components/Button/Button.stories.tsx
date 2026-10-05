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
