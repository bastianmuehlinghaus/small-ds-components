import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "./Accordion";

const meta = {
  title: "Components/Accordion",
  component: Accordion.Root,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Accordion.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    value: "tokens",
    title: "What counts as a token?",
    body: "Any value that encodes a design decision — colour, spacing, radius, type, motion. If a component needs a number and it isn't a token, that's a conversation, not a literal.",
  },
  {
    value: "tiers",
    title: "Why three tiers?",
    body: "Primitives hold the raw values, semantics say what they mean, and component tokens capture per-component decisions. Components read the semantic layer and below it nothing changes when a theme does.",
  },
  {
    value: "modes",
    title: "How does dark mode work?",
    body: "Only the semantic colour layer is redeclared. Everything downstream references it, so a component written once resolves correctly in both modes without knowing they exist.",
  },
];

export const Single: Story = {
  args: { type: "single", collapsible: true, defaultValue: "tokens" },
  render: (args) => (
    <Accordion.Root {...args} style={{ maxWidth: "40rem" }}>
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Trigger>{item.title}</Accordion.Trigger>
          <Accordion.Content>{item.body}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  ),
};

/** `type="multiple"` lets any number of panels stay open at once. */
export const Multiple: Story = {
  args: { type: "multiple", defaultValue: ["tokens", "modes"] },
  render: Single.render,
};

export const AllClosed: Story = {
  args: { type: "single", collapsible: true },
  render: Single.render,
};
