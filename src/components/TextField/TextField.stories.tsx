import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";

const meta = {
  title: "Components/TextField",
  component: TextField,
  parameters: { layout: "padded" },
  // A token path is not personal data, so browser autofill has nothing to offer
  // here. Without this, "Token name" makes browsers suggest people's names.
  args: { label: "Token name", placeholder: "color/border/focus", autoComplete: "off" },
  decorators: [(Story) => <div style={{ maxWidth: "15rem" }}><Story /></div>],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: "Use the full path, slash-separated." },
};

/** `error` marks the input invalid and replaces the description. */
export const Invalid: Story = {
  args: {
    description: "Use the full path, slash-separated.",
    error: "No token with this name.",
    defaultValue: "color/border/focsu",
  },
};

export const Disabled: Story = {
  args: { description: "Use the full path, slash-separated.", disabled: true },
};

export const Small: Story = {
  args: { size: "sm", description: "Use the full path, slash-separated." },
};
