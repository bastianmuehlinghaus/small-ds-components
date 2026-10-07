import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectField } from "./SelectField";

const modes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const tiers = [
  { value: "primitives", label: "Primitives" },
  { value: "semantics", label: "Semantics" },
  { value: "components", label: "Components" },
];

const meta: Meta<typeof SelectField> = {
  title: "Components/SelectField",
  component: SelectField,
  parameters: { layout: "padded" },
  args: { label: "Mode", options: modes, placeholder: "Choose a mode" },
  decorators: [(Story) => <div style={{ maxWidth: "15rem" }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof SelectField>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: "Applies to every page in the file." },
};

/** `error` marks the select invalid and replaces the description. */
export const Invalid: Story = {
  args: {
    description: "Applies to every page in the file.",
    error: "Choose a mode to continue.",
  },
};

export const Disabled: Story = {
  args: { description: "Applies to every page in the file.", disabled: true, defaultValue: "light" },
};

export const Small: Story = {
  args: { size: "sm", description: "Applies to every page in the file." },
};

export const Multiple: Story = {
  args: {
    multiple: true,
    label: "Tiers",
    options: tiers,
    placeholder: "Choose tiers",
    description: "Exported in this order.",
    defaultValue: ["primitives", "semantics"],
  },
};
